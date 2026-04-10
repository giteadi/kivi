// ReportSheetViewer.jsx — iframe designMode editor
// Fixed: script tag pollution in saved HTML
// Fixed: stale closure on notify — doc ref stored in useRef

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
        const r = data[i].map(c => (c == null ? "" : String(c)));
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
  if (!data) return null;
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (Array.isArray(first) && first[0] === "__html__") {
      return first[1] || "<p><br></p>";
    }
  }
  if (typeof data === "object" && !Array.isArray(data)) {
    const first = data[0];
    if (first && first[0] === "__html__") return first[1] || "<p><br></p>";
  }
  if (typeof data === "string" && data.trim().startsWith("<")) return data;
  return null;
}

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
  body { padding: 48px 56px 80px; min-height: 900px; outline: none; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 16px; font-size: 13px; }
  td, th { border: 1px solid #555; padding: 5px 10px; min-width: 60px; vertical-align: top; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  tr:nth-child(even) td { background: #fafafa; }
  h1 { font-size: 17px; font-weight: bold; text-decoration: underline; margin: 16px 0 8px; }
  h2 { font-size: 14px; font-weight: bold; text-decoration: underline; margin: 14px 0 6px; }
  h3 { font-size: 13px; font-weight: bold; margin: 12px 0 4px; }
  p  { margin: 0 0 8px; }
  ul, ol { padding-left: 24px; margin: 6px 0 10px; }
  ::selection, *::selection, td::selection, th::selection {
    background: #3B82F6 !important; color: #fff !important;
  }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ReportSheetViewer({
  data,
  readOnly = false,
  onDataChange,
  onCreateReport,
  reportMode = false,
}) {
  const iframeRef  = useRef(null);
  const onChgRef   = useRef(onDataChange);
  onChgRef.current = onDataChange;
  const timerRef   = useRef(null);

  // KEY FIX: Store live doc reference so notify() always reads current doc, never stale
  const docRef     = useRef(null);
  const mountedRef = useRef(false); // track if iframe already initialized

  // notify reads from docRef.current — always fresh, never a stale closure
  const notify = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const doc = docRef.current;
      if (!doc || !onChgRef.current) return;
      const clone = doc.body.cloneNode(true);
      clone.querySelectorAll("script").forEach(s => s.remove());
      const html = clone.innerHTML;
      if (!html || html === "<p><br></p>" || html.trim() === "") return;
      onChgRef.current(htmlToData(html));
    }, 300);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // FIX: Sirf first mount pe doc.write() karo
    // Har data change pe rewrite karne se undo stack wipe hota tha
    if (mountedRef.current) return;
    mountedRef.current = true;

    const stored = getHtml(data);
    const html   = stored !== null ? stored : arrayToHtml(data);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(buildDoc(html));
    doc.close();

    // Store fresh doc reference AFTER write
    docRef.current = doc;

    if (!readOnly) {
      doc.designMode = "on";

      const script = doc.createElement("script");
      script.textContent = `(function() {
        var RE_BODY  = /<body[^>]*>([\\s\\S]*?)<\\/body>/i;
        var RE_CMT   = /<!--[\\s\\S]*?-->/g;
        var RE_NS    = /<\\/?(?:o|w|m|v):[^>]*>/gi;
        var RE_MSO   = /\\s*style="[^"]*mso-[^"]*"/gi;
        var RE_CLASS = / class="[^"]*"/gi;
        var RE_SPAN  = /<span[^>]*>(?:<span[^>]*>)*([^<]*?)<\\/span>/gi;

        window.__savedRange = null;
        var restoring = false;

        document.addEventListener('mousedown', function(e) {
          if (e.button === 0) window.__savedRange = null;
        });

        document.addEventListener('mouseup', function() {
          requestAnimationFrame(function() {
            var sel = window.getSelection();
            if (sel && !sel.isCollapsed && sel.rangeCount) {
              window.__savedRange = sel.getRangeAt(0).cloneRange();
            } else if (window.__savedRange && !restoring) {
              restoring = true;
              sel.removeAllRanges();
              sel.addRange(window.__savedRange);
              restoring = false;
            }
          });
        });

        document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            var range = document.createRange();
            range.selectNodeContents(document.body);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            window.__savedRange = range.cloneRange();
            return;
          }
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            window.__savedRange = null;
          }
        });

        document.addEventListener('copy', function(e) {
          var sel = window.getSelection();
          var useRange = (sel && !sel.isCollapsed && sel.rangeCount)
            ? sel.getRangeAt(0) : window.__savedRange;
          if (!useRange) return;
          var div = document.createElement('div');
          div.appendChild(useRange.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html',  div.innerHTML);
            e.clipboardData.setData('text/plain', useRange.toString());
          } catch(err) {}
        });

        document.addEventListener('cut', function(e) {
          var sel = window.getSelection();
          if (!sel || sel.isCollapsed) return;
          var range = sel.getRangeAt(0);
          var div = document.createElement('div');
          div.appendChild(range.cloneContents());
          try {
            e.preventDefault();
            e.clipboardData.setData('text/html',  div.innerHTML);
            e.clipboardData.setData('text/plain', sel.toString());
            document.execCommand('delete');
            window.__savedRange = null;
            document.dispatchEvent(new Event('input', { bubbles: true }));
          } catch(_) {}
        });

        document.addEventListener('paste', function(e) {
          e.preventDefault();
          window.__savedRange = null;
          var html = e.clipboardData.getData('text/html');
          var text = e.clipboardData.getData('text/plain');

          if (html) {
            var bm = RE_BODY.exec(html);
            if (bm) html = bm[1];
            html = html
              .replace(RE_CMT,'').replace(RE_NS,'')
              .replace(RE_MSO,'').replace(RE_CLASS,'')
              .replace(RE_SPAN,'$1');
            try {
              document.execCommand('insertHTML', false, html);
            } catch(_) {
              var s = window.getSelection();
              if (s && s.rangeCount) {
                var r = s.getRangeAt(0); r.deleteContents();
                var tmp = document.createElement('div'); tmp.innerHTML = html;
                var frag = document.createDocumentFragment(), c;
                while ((c = tmp.firstChild)) frag.appendChild(c);
                r.insertNode(frag); r.collapse(false);
                s.removeAllRanges(); s.addRange(r);
              }
            }
          } else if (text) {
            try {
              document.execCommand('insertText', false, text);
            } catch(_) {
              var s = window.getSelection();
              if (s && s.rangeCount) {
                var r = s.getRangeAt(0); r.deleteContents();
                var lines = text.split('\\n');
                var frag = document.createDocumentFragment();
                lines.forEach(function(l, i) {
                  if (i > 0) frag.appendChild(document.createElement('br'));
                  frag.appendChild(document.createTextNode(l));
                });
                r.insertNode(frag); r.collapse(false);
                s.removeAllRanges(); s.addRange(r);
              }
            }
          }
          document.dispatchEvent(new Event('input', { bubbles: true }));
        });
      })();`;
      doc.body.appendChild(script);

      // Attach notify to this doc — notify reads docRef so always current
      // mouseup intentionally removed — triggers re-render which clears selection
      doc.addEventListener("input", notify);
      doc.addEventListener("keyup", notify);

      iframe.addEventListener("mousedown", () => {
        setTimeout(() => iframe.contentWindow?.focus(), 0);
      });
    }

    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, notify]);
  // data intentionally NOT in deps — sirf mount pe doc.write() hona chahiye
  // sheet switch ke liye parent mein key={activeSheet} already hai, jo remount karta hai

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
            : "Click anywhere to edit · Ctrl+A select all · Ctrl+C/V copy/paste · Ctrl+B bold"}
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
            style={{ width: "100%", minHeight: 1000, border: "none", display: "block", borderRadius: 2 }}
            title="editor"
          />
        </div>
      </div>
    </div>
  );
}