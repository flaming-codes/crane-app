import { component$ } from "@builder.io/qwik";

type Props = {
  class?: string;
};

/**
 * Primary interaction point for the user. This is the
 * pane at the start alignment of the app.
 */
export const Command = component$<Props>((props) => {
  const { class: cn } = props;

  return <div class={cn}>Command</div>;
});
