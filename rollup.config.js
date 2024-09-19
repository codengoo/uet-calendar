import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from "rollup"

const inputFile = "src/index.ts";
const name = "index";
const banner = `// uet-crawler - NghiaDT - ${(new Date()).getFullYear()}`



export default defineConfig([
    {
        input: inputFile,
        output: [
            // browser CJS bundle for Node
            {
                file: `dist/node/${name}.cjs`,
                format: "cjs",
                banner: banner,

            },
            // browser ESM bundle for CDN
            {
                file: `dist/esm/${name}.js`,
                format: "esm",
                banner: banner,
            }],
        plugins: [
            autoExternal(),
            resolve(),
            terser(),
            esbuild()
        ]
    },
    // {
    //     input: inputFile,
    //     output: [
    //         // UMD bundle for browser
    //         {
    //             file: `dist/umd/${name}.js`,
    //             format: "umd",
    //             banner: banner,
    //             name: "uet",
    //         }],
    //     plugins: [
    //         autoExternal(),
    //         resolve({ browser: true }),
    //         terser(),
    //         nodePolyfills(),
    //         esbuild()
    //     ]
    // },
    {
        input: inputFile,
        output: {
            file: `dist/${name}.d.ts`,
            format: 'es',
        },
        plugins: [
            dts(),
            copy({
                targets: [
                    { src: "package.json", dest: "dist" }
                ]
            })
        ],
    }
]);
