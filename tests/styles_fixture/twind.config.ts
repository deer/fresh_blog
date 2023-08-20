import {
  defineConfig,
  Preset,
  ThemeConfig,
} from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import presetAutoprefix from "https://esm.sh/@twind/preset-autoprefix@1.0.7";

export default {
  ...defineConfig({
    theme: {
      extend: {
        backgroundColor: {
          "primary-light": "#00ff00",
          "primary-dark": "#333333",
        },
        textColor: {
          "primary-light": "#0000FF",
          "primary-dark": "#FFFFFF",
        },
        borderColor: {
          "primary": "#0070f3",
          "primary-dark": "#e53935",
        },
      },
    } as ThemeConfig,
    presets: [presetTailwind() as Preset, presetAutoprefix() as Preset],
  }),
  selfURL: import.meta.url,
};
