interface TitleInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="无标题笔记"
      className="w-full text-[28px] font-bold text-zinc-50 placeholder:text-zinc-600 placeholder:font-normal placeholder:select-none bg-transparent focus:outline-none"
    />
  );
}
