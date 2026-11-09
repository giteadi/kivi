import React from 'react';
import { motion } from 'framer-motion';

const RevenueCard = ({ title, value, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="apple-card p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0071e3] flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
      </div>
    </motion.div>
  );
};

export default RevenueCard;
