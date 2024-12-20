const konstaConfig = require("konsta/config");

// wrap your config with konstaConfig
module.exports = konstaConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "ring-breathe": "ring-breathe 4s ease-in-out infinite",
        "logo-breathe": "logo-breathe 4s ease-in-out infinite",
      },
      keyframes: {
        "ring-breathe": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "scale(1.15)",
            opacity: "0.3",
          },
        },
        "logo-breathe": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
        },
      },
      utilities: {
        ".animation-delay-150": {
          "animation-delay": "150ms",
        },
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
        ".animation-delay-450": {
          "animation-delay": "450ms",
        },
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
      colors: {
        primary: "#532C16",
      },
    },
  },
  plugins: [],
  konsta: {
    colors: {
      primary: "#532C16",
      "brand-amber": "#92400e",
    },
    theme: "material",
    darkClasses: true,
  },
});
