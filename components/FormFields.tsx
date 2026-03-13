
import React from 'react';
import { Upload, X, PlusCircle } from 'lucide-react';
import { FileMetadata } from '../types';

export const Input: React.FC<{
  label: string;
  value: any;
  onChange: (val: string) => void;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  helperText?: string;
}> = ({ label, value, onChange, required, type = 'text', error, placeholder, helperText }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border bg-white text-black focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
        error ? 'border-rose-300 ring-rose-500/10' : 'border-slate-200'
      }`}
    />
    {helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
  </div>
);

export const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, required, error, placeholder, rows = 3 }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2.5 rounded-lg border bg-white text-black focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none ${
        error ? 'border-rose-300 ring-rose-500/10' : 'border-slate-200'
      }`}
    />
    {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
  </div>
);

export const Select: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, options, required, error }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border bg-white text-black focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none ${
        error ? 'border-rose-300 ring-rose-500/10' : 'border-slate-200'
      }`}
    >
      <option value="">Select Option...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
  </div>
);

export const MultiSelect: React.FC<{
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  error?: string;
}> = ({ label, values, onChange, options, required, error }) => {
  const toggleOption = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter(v => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className={`flex flex-wrap gap-3 p-3 rounded-xl border transition-all ${error ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleOption(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              values.includes(opt.value)
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  required?: boolean;
}> = ({ label, checked, onChange, required }) => (
  <label className="flex items-start cursor-pointer group">
    <div className="relative flex items-center mt-0.5">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-5 h-5 bg-white border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all shadow-sm" />
      <CheckIcon className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5" />
    </div>
    <span className="ml-3 text-sm text-slate-700 font-medium select-none group-hover:text-slate-900">
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
  </label>
);

const CheckIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export const RadioGroup: React.FC<{
  label: string;
  value: boolean | string;
  onChange: (val: any) => void;
  options: { label: string; value: any }[];
  required?: boolean;
  inline?: boolean;
}> = ({ label, value, onChange, options, required, inline = false }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className={`flex ${inline ? 'flex-row flex-wrap gap-6' : 'flex-col gap-2'}`}>
      {options.map((opt, i) => (
        <label key={i} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name={label}
            className="sr-only peer"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-indigo-600 peer-checked:bg-white flex items-center justify-center transition-all group-hover:border-slate-400">
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full opacity-0 peer-checked:opacity-100 transition-all scale-0 peer-checked:scale-100" />
          </div>
          <span className="ml-3 text-sm text-slate-700 group-hover:text-slate-900">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

export const FileUpload: React.FC<{
  label: string;
  onFileSelect: (meta: FileMetadata | null) => void;
  metadata: FileMetadata | null;
  helperText?: string;
}> = ({ label, onFileSelect, metadata, helperText }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {metadata ? (
        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
          <div className="flex items-center truncate">
            <Upload className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
            <div className="truncate">
              <p className="text-sm font-medium text-slate-900 truncate">{metadata.file_name}</p>
              <p className="text-xs text-slate-500">{(metadata.file_size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-rose-500" />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <input
            type="file"
            onChange={handleFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl group-hover:border-indigo-400 bg-slate-50 group-hover:bg-indigo-50/30 transition-all">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
            <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">Click to upload policy document</p>
            {helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export const RepeatableSection: React.FC<{
  title: string;
  items: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
}> = ({ title, items, onAdd, onRemove, renderItem }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <button 
        type="button"
        onClick={onAdd}
        className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <PlusCircle className="w-4 h-4 mr-1.5" />
        Add another
      </button>
    </div>
    {items.length === 0 && (
      <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
        <p className="text-slate-500">No entries added yet.</p>
      </div>
    )}
    {items.map((item, index) => (
      <div key={index} className="relative p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        {items.length > 0 && (
          <button 
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {renderItem(item, index)}
      </div>
    ))}
  </div>
);
