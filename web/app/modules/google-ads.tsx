import { clsx } from "clsx";
import { cva, VariantProps } from "cva";
import { useEffect } from "react";

export type GoogleAdsConfig = {
  client: string;
  leftSlot: string;
  rightSlot: string;
};

const twSlot = cva({
  base: "adsbygoogle",
  variants: {
    placement: {
      inline: "w-full min-h-[250px]",
      rail: "w-[160px] min-h-[600px]",
    },
  },
  defaultVariants: {
    placement: "inline",
  },
});

type SlotProps = VariantProps<typeof twSlot> & {
  client: string;
  slot: string;
  className?: string;
  label: string;
};

export function GoogleAdSlot(props: SlotProps) {
  const { client, slot, placement, className, label } = props;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore ad-slot failures outside production.
    }
  }, [client, slot]);

  return (
    <ins
      className={clsx(twSlot({ placement }), className)}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      aria-label={label}
    />
  );
}

type AdsProps = {
  config: GoogleAdsConfig;
};

export function GoogleAdsRail({ config }: AdsProps) {
  return (
    <>
      <div className="fixed top-24 left-6 z-20 hidden min-[1600px]:flex">
        <GoogleAdSlot
          placement="rail"
          client={config.client}
          slot={config.leftSlot}
          label="Left page advertisement"
        />
      </div>
      <div className="fixed top-24 right-6 z-20 hidden min-[1600px]:flex">
        <GoogleAdSlot
          placement="rail"
          client={config.client}
          slot={config.rightSlot}
          label="Right page advertisement"
        />
      </div>
    </>
  );
}

export function GoogleAdsInline({ config }: AdsProps) {
  return (
    <div className="full-width pt-8 pb-16 min-[1600px]:hidden">
      <div className="flex flex-col gap-6">
        <GoogleAdSlot
          placement="inline"
          client={config.client}
          slot={config.leftSlot}
          label="Inline page advertisement (left slot)"
        />
        <GoogleAdSlot
          placement="inline"
          client={config.client}
          slot={config.rightSlot}
          label="Inline page advertisement (right slot)"
        />
      </div>
    </div>
  );
}

GoogleAdSlot.displayName = "GoogleAdSlot";
GoogleAdsRail.displayName = "GoogleAdsRail";
GoogleAdsInline.displayName = "GoogleAdsInline";
