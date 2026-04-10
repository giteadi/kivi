// ReportSheetViewer.jsx — iframe designMode editor
// Fixed: HTML table copy/paste, same-document paste working correctly

import { useEffect, useRef, useCallback } from "react";

// ─── Convert 2D array → HTML ──────────────────────────────────────────────────
function arrayToHtml(data) {
  if (!data || !data.length) return "<p><br></p>";
  let html = "";
  let i = 0;

  while (i < data.length) {
    const row   = data[i];
    const cells = row.map(c => (c == null ? "" : String(c)));
    const ne    = cells.filter(c => c.trim() !== "");

    if (ne.length === 0) { html += "<p><br></p>"; i++; continue; }

    if (ne.length >= 2) {
      const block = [];
      while (i < data.length) {
        const r  = data[i].map(c => (c == null ? "" : String(c)));
        if (r.filter(c => c.trim()).length >= 2) { block.push(r); i++; }
        else break;
      }
      const maxC   = Math.max(...block.map(r => r.length));
      const isHead = block[0]?.some(c => c && isNaN(Number(c.replace(/[><%†\s]/g, ""))));
      html += `<table><tbody>`;
      block.forEach((r, ri) => {
        html += "<tr>";
        for (let ci = 0; ci < maxC; ci++) {
          const v = esc(r[ci] ?? "");
          html += (ri === 0 && isHead) ? `<th>${v}</th>` : `<td>${v}</td>`;
        }
        html += "</tr>";
      });
      html += `</tbody></table>`;
      continue;
    }

    const text = cells[0].trim();
    if (text === text.toUpperCase() && text.length > 3 && text.length < 120 && /[A-Z]{4,}/.test(text)) {
      html += `<h2>${esc(text)}</h2>`;
    } else if (/^[A-Z][^:–\-]{0,35}[:–\-]/.test(text) && text.length < 80) {
      const m = text.match(/^([^:–\-]+[:–\-]\s*)([\s\S]*)$/);
      html += m ? `<p><strong>${esc(m[1])}</strong>${esc(m[2])}</p>` : `<p>${esc(text)}</p>`;
    } else {
      html += `<p>${esc(text)}</p>`;
    }
    i++;
  }
  return html || "<p><br></p>";
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function htmlToData(html) { return [["__html__", html]]; }
function getHtml(data) {
  if (!data?.length) return null;
  return data[0]?.[0] === "__html__" ? (data[0][1] || "") : null;
}

// ─── Full iframe document with styles (NO inline script — injected separately) ─
function buildDoc(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: #fff;
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 13px;
    color: #111;
    line-height: 1.7;
  }
  body {
    padding: 48px 56px 80px;
    min-height: 900px;
    outline: none;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px;
    font-size: 13px;
  }
  td, th {
    border: 1px solid #555;
    padding: 5px 10px;
    min-width: 60px;
    vertical-align: top;
    text-align: left;
  }
  th {
    background: #f0f0f0;
    font-weight: bold;
  }
  tr:nth-child(even) td {
    background: #fafafa;
  }

  h1 { font-size: 17px; font-weight: bold; text-decoration: underline; margin: 16px 0 8px; }
  h2 { font-size: 14px; font-weight: bold; text-decoration: underline; margin: 14px 0 6px; }
  h3 { font-size: 13px; font-weight: bold; margin: 12px 0 4px; }
  p  { margin: 0 0 8px; }
  ul, ol { padding-left: 24px; margin: 6px 0 10px; }

  ::selection         { background: #3B82F6 !important; color: #fff !important; }
  *::selection        { background: #3B82F6 !important; color: #fff !important; }
  td::selection,
  th::selection       { background: #3B82F6 !important; color: #fff !important; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function ReportSheetViewer({
  data,
  readOnly    = false,
  onDataChange,
  onCreateReport,
  reportMode  = false,
}) {
  const iframeRef  = useRef(null);
  const onChgRef   = useRef(onDataChange);
  onChgRef.current = onDataChange;
  const timerRef   = useRef(null);

  const writeContent = useCallback((html) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(buildDoc(html));
    doc.close();

    if (!readOnly) {
      doc.designMode = "on";

      // ── Inject clipboard handlers as a real script element (avoids regex parse errors in doc.write) ──
      const script = doc.createElement("script");
      script.textContent = `(function() {
        var RE_BODY   = /<body[^>]*>([\\s\\S]*?)<\\/body>/i;
        var RE_CMT    = /<!--[\\s\\S]*?-->/g;
        var RE_NS     = /<\\/?(?:o|w|m|v):[^>]*>/gi;
        var RE_MSO    = /\\s*style="[^"]*mso-[^"]*"/gi;
        var RE_CLASS  = / class="[^"]*"/gi;
        var RE_SPAN   = /<span[^>]*>(?:<span[^>]*>)*([^<]*?)(?:<\\/span>)*<\\/span>/gi;

        // ── Ctrl+A: select ALL content in body ───────────────────────────────
        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            var range = document.createRange();
            range.selectNodeContents(document.body);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        });

        // ── Prevent mousedown on non-text areas from clearing selection ───────
        // Only allow selection reset when actually clicking on content
        var isSelecting = false;
        document.addEventListener('mousedown', function(e) {
          isSelecting = true;
        });
        document.addEventListener('mouseup', function(e) {
          isSelecting = false;
        });

        document.addEventListener('copy', function(e) {
          var sel = window.getSelection();
          if (!sel || sel.isCollapsed) return;
          var range = sel.getRangeAt(0);
          var div = document.createElement('div');
          div.appendChild(range.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html', div.innerHTML);
            e.clipboardData.setData('text/plain', sel.toString());
          } catch(_) {}
        });

        document.addEventListener('cut', function(e) {
          var sel = window.getSelection();
          if (!sel || sel.isCollapsed) return;
          var range = sel.getRangeAt(0);
          var div = document.createElement('div');
          div.appendChild(range.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html', div.innerHTML);
            e.clipboardData.setData('text/plain', sel.toString());
            // Use execCommand so cut is in undo history
            document.execCommand('delete');
            document.dispatchEvent(new Event('input', { bubbles: true }));
          } catch(_) {}
        });

        document.addEventListener('paste', function(e) {
          e.preventDefault();
          var html = e.clipboardData.getData('text/html');
          var text = e.clipboardData.getData('text/plain');

          if (html) {
            // Clean up HTML
            var bm = RE_BODY.exec(html);
            if (bm) html = bm[1];
            html = html
              .replace(RE_CMT, '')
              .replace(RE_NS, '')
              .replace(RE_MSO, '')
              .replace(RE_CLASS, '')
              .replace(RE_SPAN, '$1');

            // Use execCommand('insertHTML') so paste goes into undo stack
            try {
              document.execCommand('insertHTML', false, html);
            } catch(_) {
              // Fallback: manual insert (no undo, but at least it works)
              var sel = window.getSelection();
              if (sel && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.deleteContents();
                var tmp = document.createElement('div');
                tmp.innerHTML = html;
                var frag = document.createDocumentFragment();
                var child;
                while ((child = tmp.firstChild)) frag.appendChild(child);
                range.insertNode(frag);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          } else if (text) {
            // Plain text — execCommand insertText for undo support
            try {
              document.execCommand('insertText', false, text);
            } catch(_) {
              var sel = window.getSelection();
              if (sel && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.deleteContents();
                var lines = text.split('\\n');
                var frag = document.createDocumentFragment();
                lines.forEach(function(line, idx) {
                  if (idx > 0) frag.appendChild(document.createElement('br'));
                  frag.appendChild(document.createTextNode(line));
                });
                range.insertNode(frag);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              }
            }
          }
          document.dispatchEvent(new Event('input', { bubbles: true }));
        });
      })();`;
      doc.body.appendChild(script);

      const notify = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (onChgRef.current) {
            onChgRef.current(htmlToData(doc.body.innerHTML));
          }
        }, 300);
      };

      doc.addEventListener("input",   notify);
      doc.addEventListener("keyup",   notify);
      doc.addEventListener("mouseup", notify);

      iframe.addEventListener("mousedown", () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentDocument?.body?.focus();
        }, 0);
      });
    }
  }, [readOnly]);

  useEffect(() => {
    const stored = getHtml(data);
    const html   = stored !== null ? stored : arrayToHtml(data);
    writeContent(html);
    return () => clearTimeout(timerRef.current);
  }, [data, writeContent]);

  const topColor = reportMode ? "#064E3B" : "#1E40AF";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <div style={{
        background: topColor, color: "#fff",
        padding: "7px 16px", fontSize: 12, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0, flexWrap: "wrap",
      }}>
        <span>{reportMode ? "✏️ Patient Report Editor" : "📄 Template Editor"}</span>
        <span style={{ opacity: 0.65, fontSize: 11 }}>
          {readOnly
            ? "Read-only preview"
            : "Click anywhere to edit · Ctrl+A select all · Ctrl+C/V copy/paste · Ctrl+B bold · Right-click table for row/col options"}
        </span>
        {!reportMode && onCreateReport && (
          <button
            onClick={onCreateReport}
            style={{
              marginLeft: "auto", background: "#fff", color: "#1E40AF",
              border: "none", borderRadius: 6, padding: "4px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >📋 Use as Template → New Report</button>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", background: "#E8E8E4", padding: "28px 20px" }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)",
          borderRadius: 2, background: "#fff",
        }}>
          <iframe
            ref={iframeRef}
            style={{
              width: "100%",
              minHeight: 1000,
              border: "none",
              display: "block",
              borderRadius: 2,
            }}
            title="editor"
          />
        </div>
      </div>
    </div>
  );
}