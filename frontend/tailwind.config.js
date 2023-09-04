/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        Monoton: ["Monoton"],
        Rubik: ['"Rubik Iso"'],
        Caveat: ['"Caveat"'],
        Qwigley: ["Qwigley"],
        cedarville: ['"cedarville Cursive"'],
        Neonderthaw: ["Neonderthaw"],
        Watterfall: ["Watterfall"],
        Madi: ['"Ms Madi"'],
        Redressed: ['"Redressed"'],
        Klee: ['"Klee One"'],
        Telescope: ['"Annie Use Your Telescope"'],
        Itim: ["Itim"],
        Slackside: ['"Slackside One"'],
        Satisfy: ["Satisfy "],
        Cutive: ['"Cutive Mono"'],
        DM: ['"DM Mono "'],
        Garamond: ['"EB Garamond"'],
        Grandiflora: ['"Grandiflora One"'],
        Diphylleia: ["Diphylleia"],
        Rokkitt: ["Rokkitt"],
      },
      screens: {
        xm: { min: "300px", max: "680px" },
        ssm: { min: "680px", max: "768px" },
        smd: { min: "768px", max: "1024px" },
        slg: { min: "1024px", max: "1280px" },
        sxl: { max: "1424px", min: "1280px" },
        sxxl: "1424px",
      },
    },
  },
  screen: {
    sm: "600px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  plugins: [require("tw-elements/dist/plugin")],
};

