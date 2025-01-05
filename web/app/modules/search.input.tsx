import { clsx } from "clsx";
import { RefObject, ReactNode } from "react";

type Props = {
  input?: string;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  actions?: ReactNode;
  inputClassName?: string;
  setIsFocused: (isFocused: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SearchInput(props: Props) {
  const {
    input,
    inputRef,
    isFocused,
    setIsFocused,
    actions,
    inputClassName,
    onChange,
  } = props;

  return (
    <div className="relative flex h-14 items-center">
      <input
        ref={inputRef}
        type="search"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        placeholder={
          isFocused
            ? "Search by name or description of what you want"
            : "Search..."
        }
        className={clsx(
          "h-full flex-1 bg-transparent outline-none focus:placeholder:opacity-50",
          "transition-all",
          inputClassName,
        )}
        value={input}
        onFocus={() => setIsFocused(true)}
        onChange={onChange}
      />
      {actions}
    </div>
  );
}
