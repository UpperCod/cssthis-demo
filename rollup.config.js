import cssthis from "rollup-plugin-cssthis";
import autoprefixer from "autoprefixer";
import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";

export default {
    input: "src/index.js",
    output: [{ file: "dist/index.js", format: "cjs", sourcemap: true }],
    external: ["rollup-pluginutils"],
    plugins: [
        resolve(),
        cssthis({
            plugins: [autoprefixer({ browsers: "last 2 versions" })]
        }),
        buble({
            jsx: "h",
            objectAssign: "Object.assign"
        })
    ]
};
