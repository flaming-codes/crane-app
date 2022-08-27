type Params = {
  code: string;
  alt?: boolean;
  control?: boolean;
  shift?: boolean;
  callback?: (params: { node: any }, e: KeyboardEvent) => void;
};

export function shortcut(node: any, params: Params) {
  let handler: (e: KeyboardEvent) => void;

  const removeHandler = () => window.removeEventListener('keydown', handler);
  const setHandler = () => {
    removeHandler();
    if (!params) return;

    handler = (e: KeyboardEvent) => {
      if (
        !!params.alt !== e.altKey ||
        !!params.shift !== e.shiftKey ||
        !!params.control !== (e.ctrlKey || e.metaKey) ||
        params.code !== e.code
      )
        return;
      e.preventDefault();
      params.callback ? params.callback({ node }, e) : node.click();
    };

    window.addEventListener('keydown', handler);
  };

  setHandler();

  return {
    update: setHandler,
    destroy: removeHandler
  };
}
