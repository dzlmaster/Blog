// vite.config.ts
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { loadEnv } from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/vite@4.5.0_@types+node@20.9.0_less@4.2.0_sass@1.69.5/node_modules/vite/dist/node/index.js";

// plugins/index.ts
import vue from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/@vitejs+plugin-vue@4.4.1_vite@4.5.0_vue@3.3.8/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.2_vite@4.5.0_vue@3.3.8/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@10.6.0/node_modules/unplugin-auto-import/dist/vite.js";
import GenerateConfig from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/unplugin-config@0.1.3_esbuild@0.19.5_vite@4.5.0/node_modules/unplugin-config/dist/vite.js";
import Components from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/unplugin-vue-components@0.25.2_vue@3.3.8/node_modules/unplugin-vue-components/dist/vite.mjs";
import VitePluginPreloadAll from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/vite-plugin-preload@0.3.1_vite@4.5.0/node_modules/vite-plugin-preload/dist/index.mjs";
import Unocss from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/unocss@0.56.5_postcss@8.4.38_vite@4.5.0/node_modules/unocss/dist/vite.mjs";
import AntdvResolver from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/antdv-component-resolver@1.0.4_unplugin-vue-components@0.25.2/node_modules/antdv-component-resolver/dist/index.mjs";

// plugins/constants.ts
var GLOB_CONFIG_FILE_NAME = "_app.config.js";
var OUTPUT_DIR = "dist";

// plugins/vite-build-info.ts
import { readdir, stat } from "node:fs";
import dayjs from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import duration from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/plugin/duration.js";
import pkg from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/node_modules/.pnpm/picocolors@1.0.0/node_modules/picocolors/picocolors.js";
var { green, blue, bold } = pkg;
dayjs.extend(duration);
var fileListTotal = [];
function recursiveDirectory(folder, callback) {
  readdir(folder, (err, files) => {
    if (err)
      throw err;
    let count = 0;
    const checkEnd = () => {
      ++count === files.length && callback();
    };
    files.forEach((item) => {
      stat(`${folder}/${item}`, async (err2, stats) => {
        if (err2)
          throw err2;
        if (stats.isFile()) {
          fileListTotal.push(stats.size);
          checkEnd();
        } else if (stats.isDirectory()) {
          recursiveDirectory(`${folder}/${item}/`, checkEnd);
        }
      });
    });
    files.length === 0 && callback();
  });
}
function sum(arr) {
  return arr.reduce((t, c) => {
    return t + c;
  }, 0);
}
function formatBytes(a, b) {
  if (a === 0)
    return "0 Bytes";
  const c = 1024;
  const d = b || 2;
  const e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const f = Math.floor(Math.log(a) / Math.log(c));
  return `${Number.parseFloat((a / c ** f).toFixed(d))} ${e[f]}`;
}
function viteBuildInfo(name) {
  let config;
  let startTime;
  let endTime;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      console.log(
        bold(
          green(
            `\u{1F44F}\u6B22\u8FCE\u4F7F\u7528${blue(`[${name}]`)}\uFF0C\u73B0\u5728\u6B63\u5168\u529B\u4E3A\u60A8${config.command === "build" ? "\u6253\u5305" : "\u7F16\u8BD1"}`
          )
        )
      );
      if (config.command === "build")
        startTime = dayjs(/* @__PURE__ */ new Date());
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(/* @__PURE__ */ new Date());
        recursiveDirectory(config.build.outDir, () => {
          console.log(
            bold(
              green(
                `\u606D\u559C\u6253\u5305\u5B8C\u6210\u{1F389}\uFF08\u603B\u7528\u65F6${dayjs.duration(endTime.diff(startTime)).format("mm\u5206ss\u79D2")}\uFF0C\u6253\u5305\u540E\u7684\u5927\u5C0F\u4E3A${formatBytes(
                  sum(fileListTotal)
                )}\uFF09`
              )
            )
          );
        });
      }
    }
  };
}

// plugins/index.ts
function createVitePlugins(env) {
  const vitePluginList = [
    vue(),
    vueJsx(),
    VitePluginPreloadAll(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/core",
        "pinia"
      ],
      dts: "types/auto-imports.d.ts",
      dirs: ["src/stores", "src/composables"]
    }),
    Components({
      resolvers: [AntdvResolver()],
      dts: "types/components.d.ts",
      dirs: ["src/components"]
    }),
    // https://github.com/kirklin/unplugin-config
    GenerateConfig({
      appName: env.VITE_GLOB_APP_TITLE,
      configFile: {
        generate: true,
        fileName: GLOB_CONFIG_FILE_NAME,
        outputDir: OUTPUT_DIR
      },
      envVariables: {
        prefix: "VITE_GLOB_"
      }
    }),
    Unocss(),
    viteBuildInfo(env.VITE_APP_NAME)
  ];
  return vitePluginList;
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-admin/vite.config.ts";
var baseSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: createVitePlugins(env),
    resolve: {
      alias: [
        {
          find: "dayjs",
          replacement: "dayjs/esm"
        },
        {
          find: /^dayjs\/locale/,
          replacement: "dayjs/esm/locale"
        },
        {
          find: /^dayjs\/plugin/,
          replacement: "dayjs/esm/plugin"
        },
        {
          find: "vue-i18n",
          replacement: mode === "development" ? "vue-i18n/dist/vue-i18n.esm-browser.js" : "vue-i18n/dist/vue-i18n.esm-bundler.js"
        },
        {
          find: /^ant-design-vue\/es$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue\/dist$/,
          replacement: "ant-design-vue/dist"
        },
        {
          find: /^ant-design-vue\/lib$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: /^ant-design-vue$/,
          replacement: "ant-design-vue/es"
        },
        {
          find: "lodash",
          replacement: "lodash-es"
        },
        {
          find: "~@",
          replacement: baseSrc
        },
        {
          find: "~",
          replacement: baseSrc
        },
        {
          find: "@",
          replacement: baseSrc
        },
        {
          find: "~#",
          replacement: resolve(baseSrc, "./enums")
        }
      ]
    },
    build: {
      chunkSizeWarningLimit: 4096,
      outDir: OUTPUT_DIR,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
            antd: ["ant-design-vue", "@ant-design/icons-vue", "dayjs"]
            // lodash: ['loadsh-es'],
          }
        }
      }
    },
    server: {
      port: 6678,
      host: "0.0.0.0",
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), "")
        }
      }
    },
    test: {
      globals: true,
      environment: "jsdom"
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy9pbmRleC50cyIsICJwbHVnaW5zL2NvbnN0YW50cy50cyIsICJwbHVnaW5zL3ZpdGUtYnVpbGQtaW5mby50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGdpdGNvZGVcXFxccnV5dS1ibG9nXFxcXGJsb2ctZnJvbnRlbmRcXFxca3VhaWxlbWFvLWFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxnaXRjb2RlXFxcXHJ1eXUtYmxvZ1xcXFxibG9nLWZyb250ZW5kXFxcXGt1YWlsZW1hby1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZ2l0Y29kZS9ydXl1LWJsb2cvYmxvZy1mcm9udGVuZC9rdWFpbGVtYW8tYWRtaW4vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXHJcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IGNyZWF0ZVZpdGVQbHVnaW5zIH0gZnJvbSAnLi9wbHVnaW5zJ1xyXG5pbXBvcnQgeyBPVVRQVVRfRElSIH0gZnJvbSAnLi9wbHVnaW5zL2NvbnN0YW50cydcclxuXHJcbmNvbnN0IGJhc2VTcmMgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKGVudiksXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ2RheWpzJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnZGF5anMvZXNtJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eZGF5anNcXC9sb2NhbGUvLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdkYXlqcy9lc20vbG9jYWxlJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eZGF5anNcXC9wbHVnaW4vLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdkYXlqcy9lc20vcGx1Z2luJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd2dWUtaTE4bicsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmVzbS1icm93c2VyLmpzJyA6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmVzbS1idW5kbGVyLmpzJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9lcyQvLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9lcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlXFwvZGlzdCQvLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9kaXN0JyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9saWIkLyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnYW50LWRlc2lnbi12dWUvZXMnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogL15hbnQtZGVzaWduLXZ1ZSQvLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9lcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnbG9kYXNoJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiAnbG9kYXNoLWVzJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd+QCcsXHJcbiAgICAgICAgICByZXBsYWNlbWVudDogYmFzZVNyYyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICd+JyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBiYXNlU3JjLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ0AnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmaW5kOiAnfiMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHJlc29sdmUoYmFzZVNyYywgJy4vZW51bXMnKSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNDA5NixcclxuICAgICAgb3V0RGlyOiBPVVRQVVRfRElSLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgdnVlOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJywgJ3Z1ZS1pMThuJywgJ0B2dWV1c2UvY29yZSddLFxyXG4gICAgICAgICAgICBhbnRkOiBbJ2FudC1kZXNpZ24tdnVlJywgJ0BhbnQtZGVzaWduL2ljb25zLXZ1ZScsICdkYXlqcyddLFxyXG4gICAgICAgICAgICAvLyBsb2Rhc2g6IFsnbG9hZHNoLWVzJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHBvcnQ6IDY2NzgsXHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtlbnYuVklURV9BUFBfQkFTRV9BUEl9YCksICcnKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICB9LFxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGdpdGNvZGVcXFxccnV5dS1ibG9nXFxcXGJsb2ctZnJvbnRlbmRcXFxca3VhaWxlbWFvLWFkbWluXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdpdGNvZGVcXFxccnV5dS1ibG9nXFxcXGJsb2ctZnJvbnRlbmRcXFxca3VhaWxlbWFvLWFkbWluXFxcXHBsdWdpbnNcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2dpdGNvZGUvcnV5dS1ibG9nL2Jsb2ctZnJvbnRlbmQva3VhaWxlbWFvLWFkbWluL3BsdWdpbnMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBHZW5lcmF0ZUNvbmZpZyBmcm9tICd1bnBsdWdpbi1jb25maWcvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IFZpdGVQbHVnaW5QcmVsb2FkQWxsIGZyb20gJ3ZpdGUtcGx1Z2luLXByZWxvYWQnXHJcbmltcG9ydCBVbm9jc3MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBBbnRkdlJlc29sdmVyIGZyb20gJ2FudGR2LWNvbXBvbmVudC1yZXNvbHZlcidcclxuaW1wb3J0IHsgR0xPQl9DT05GSUdfRklMRV9OQU1FLCBPVVRQVVRfRElSIH0gZnJvbSAnLi9jb25zdGFudHMnXHJcbmltcG9ydCB7IHZpdGVCdWlsZEluZm8gfSBmcm9tICcuL3ZpdGUtYnVpbGQtaW5mbydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucyhlbnY6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICBjb25zdCB2aXRlUGx1Z2luTGlzdDogKFBsdWdpbk9wdGlvbiB8IFBsdWdpbk9wdGlvbltdKVtdID0gW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVKc3goKSxcclxuICAgIFZpdGVQbHVnaW5QcmVsb2FkQWxsKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAndnVlLWkxOG4nLFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgIF0sXHJcbiAgICAgIGR0czogJ3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvc3RvcmVzJywgJ3NyYy9jb21wb3NhYmxlcyddLFxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbQW50ZHZSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiAndHlwZXMvY29tcG9uZW50cy5kLnRzJyxcclxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cyddLFxyXG4gICAgfSksXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20va2lya2xpbi91bnBsdWdpbi1jb25maWdcclxuICAgIEdlbmVyYXRlQ29uZmlnKHtcclxuICAgICAgYXBwTmFtZTogZW52LlZJVEVfR0xPQl9BUFBfVElUTEUsXHJcbiAgICAgIGNvbmZpZ0ZpbGU6IHtcclxuICAgICAgICBnZW5lcmF0ZTogdHJ1ZSxcclxuICAgICAgICBmaWxlTmFtZTogR0xPQl9DT05GSUdfRklMRV9OQU1FLFxyXG4gICAgICAgIG91dHB1dERpcjogT1VUUFVUX0RJUixcclxuICAgICAgfSxcclxuICAgICAgZW52VmFyaWFibGVzOiB7XHJcbiAgICAgICAgcHJlZml4OiAnVklURV9HTE9CXycsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIFVub2NzcygpLFxyXG4gICAgdml0ZUJ1aWxkSW5mbyhlbnYuVklURV9BUFBfTkFNRSksXHJcbiAgXVxyXG4gIHJldHVybiB2aXRlUGx1Z2luTGlzdFxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcZ2l0Y29kZVxcXFxydXl1LWJsb2dcXFxcYmxvZy1mcm9udGVuZFxcXFxrdWFpbGVtYW8tYWRtaW5cXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZ2l0Y29kZVxcXFxydXl1LWJsb2dcXFxcYmxvZy1mcm9udGVuZFxcXFxrdWFpbGVtYW8tYWRtaW5cXFxccGx1Z2luc1xcXFxjb25zdGFudHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2dpdGNvZGUvcnV5dS1ibG9nL2Jsb2ctZnJvbnRlbmQva3VhaWxlbWFvLWFkbWluL3BsdWdpbnMvY29uc3RhbnRzLnRzXCI7Ly8gVGhpcyBjb25zdGFudCBkZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBjb25maWd1cmF0aW9uIGZpbGUgdGhhdCB3aWxsIGJlIHVzZWQgaW4gdGhlIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRcclxuZXhwb3J0IGNvbnN0IEdMT0JfQ09ORklHX0ZJTEVfTkFNRSA9ICdfYXBwLmNvbmZpZy5qcydcclxuXHJcbi8vIFRoaXMgY29uc3RhbnQgc2V0cyB0aGUgb3V0cHV0IGRpcmVjdG9yeSBmb3IgdGhlIFZpdGUgcGFja2FnZVxyXG5leHBvcnQgY29uc3QgT1VUUFVUX0RJUiA9ICdkaXN0J1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGdpdGNvZGVcXFxccnV5dS1ibG9nXFxcXGJsb2ctZnJvbnRlbmRcXFxca3VhaWxlbWFvLWFkbWluXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdpdGNvZGVcXFxccnV5dS1ibG9nXFxcXGJsb2ctZnJvbnRlbmRcXFxca3VhaWxlbWFvLWFkbWluXFxcXHBsdWdpbnNcXFxcdml0ZS1idWlsZC1pbmZvLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9naXRjb2RlL3J1eXUtYmxvZy9ibG9nLWZyb250ZW5kL2t1YWlsZW1hby1hZG1pbi9wbHVnaW5zL3ZpdGUtYnVpbGQtaW5mby50c1wiO2ltcG9ydCB7IHJlYWRkaXIsIHN0YXQgfSBmcm9tICdub2RlOmZzJ1xyXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXHJcbmltcG9ydCB0eXBlIHsgRGF5anMgfSBmcm9tICdkYXlqcydcclxuaW1wb3J0IGR1cmF0aW9uIGZyb20gJ2RheWpzL3BsdWdpbi9kdXJhdGlvbidcclxuaW1wb3J0IHBrZyBmcm9tICdwaWNvY29sb3JzJ1xyXG5cclxuY29uc3QgeyBncmVlbiwgYmx1ZSwgYm9sZCB9ID0gcGtnXHJcbmRheWpzLmV4dGVuZChkdXJhdGlvbilcclxuXHJcbmNvbnN0IGZpbGVMaXN0VG90YWw6IG51bWJlcltdID0gW11cclxuXHJcbmZ1bmN0aW9uIHJlY3Vyc2l2ZURpcmVjdG9yeShmb2xkZXI6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgcmVhZGRpcihmb2xkZXIsIChlcnIsIGZpbGVzOiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgaWYgKGVycilcclxuICAgICAgdGhyb3cgZXJyXHJcbiAgICBsZXQgY291bnQgPSAwXHJcbiAgICBjb25zdCBjaGVja0VuZCA9ICgpID0+IHtcclxuICAgICAgKytjb3VudCA9PT0gZmlsZXMubGVuZ3RoICYmIGNhbGxiYWNrKClcclxuICAgIH1cclxuICAgIGZpbGVzLmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xyXG4gICAgICBzdGF0KGAke2ZvbGRlcn0vJHtpdGVtfWAsIGFzeW5jIChlcnIsIHN0YXRzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycilcclxuICAgICAgICAgIHRocm93IGVyclxyXG4gICAgICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkge1xyXG4gICAgICAgICAgZmlsZUxpc3RUb3RhbC5wdXNoKHN0YXRzLnNpemUpXHJcbiAgICAgICAgICBjaGVja0VuZCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICAgIHJlY3Vyc2l2ZURpcmVjdG9yeShgJHtmb2xkZXJ9LyR7aXRlbX0vYCwgY2hlY2tFbmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIGZpbGVzLmxlbmd0aCA9PT0gMCAmJiBjYWxsYmFjaygpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gc3VtKGFycjogbnVtYmVyW10pIHtcclxuICByZXR1cm4gYXJyLnJlZHVjZSgodDogbnVtYmVyLCBjOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiB0ICsgY1xyXG4gIH0sIDApXHJcbn1cclxuZnVuY3Rpb24gZm9ybWF0Qnl0ZXMoYTogbnVtYmVyLCBiPzogbnVtYmVyKTogc3RyaW5nIHtcclxuICBpZiAoYSA9PT0gMClcclxuICAgIHJldHVybiAnMCBCeXRlcydcclxuICBjb25zdCBjID0gMTAyNFxyXG4gIGNvbnN0IGQgPSBiIHx8IDJcclxuICBjb25zdCBlID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddXHJcbiAgY29uc3QgZiA9IE1hdGguZmxvb3IoTWF0aC5sb2coYSkgLyBNYXRoLmxvZyhjKSlcclxuICByZXR1cm4gYCR7TnVtYmVyLnBhcnNlRmxvYXQoKGEgLyBjICoqIGYpLnRvRml4ZWQoZCkpfSAke2VbZl19YFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdml0ZUJ1aWxkSW5mbyhuYW1lOiBzdHJpbmcpOiBQbHVnaW4ge1xyXG4gIGxldCBjb25maWc6IFJlc29sdmVkQ29uZmlnXHJcbiAgbGV0IHN0YXJ0VGltZTogRGF5anNcclxuICBsZXQgZW5kVGltZTogRGF5anNcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ3ZpdGU6YnVpbGRJbmZvJyxcclxuICAgIGNvbmZpZ1Jlc29sdmVkKHJlc29sdmVkQ29uZmlnKSB7XHJcbiAgICAgIGNvbmZpZyA9IHJlc29sdmVkQ29uZmlnXHJcbiAgICB9LFxyXG4gICAgYnVpbGRTdGFydCgpIHtcclxuICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgYm9sZChcclxuICAgICAgICAgIGdyZWVuKFxyXG4gICAgICAgICAgICBgXHVEODNEXHVEQzRGXHU2QjIyXHU4RkNFXHU0RjdGXHU3NTI4JHtibHVlKGBbJHtuYW1lfV1gKX1cdUZGMENcdTczQjBcdTU3MjhcdTZCNjNcdTUxNjhcdTUyOUJcdTRFM0FcdTYwQTgke2NvbmZpZy5jb21tYW5kID09PSAnYnVpbGQnID8gJ1x1NjI1M1x1NTMwNScgOiAnXHU3RjE2XHU4QkQxJ1xyXG4gICAgICAgICAgICB9YCxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgKSxcclxuICAgICAgKVxyXG4gICAgICBpZiAoY29uZmlnLmNvbW1hbmQgPT09ICdidWlsZCcpXHJcbiAgICAgICAgc3RhcnRUaW1lID0gZGF5anMobmV3IERhdGUoKSlcclxuICAgIH0sXHJcbiAgICBjbG9zZUJ1bmRsZSgpIHtcclxuICAgICAgaWYgKGNvbmZpZy5jb21tYW5kID09PSAnYnVpbGQnKSB7XHJcbiAgICAgICAgZW5kVGltZSA9IGRheWpzKG5ldyBEYXRlKCkpXHJcbiAgICAgICAgcmVjdXJzaXZlRGlyZWN0b3J5KGNvbmZpZy5idWlsZC5vdXREaXIsICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICBib2xkKFxyXG4gICAgICAgICAgICAgIGdyZWVuKFxyXG4gICAgICAgICAgICAgICAgYFx1NjA2RFx1NTU5Q1x1NjI1M1x1NTMwNVx1NUI4Q1x1NjIxMFx1RDgzQ1x1REY4OVx1RkYwOFx1NjAzQlx1NzUyOFx1NjVGNiR7ZGF5anNcclxuICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKGVuZFRpbWUuZGlmZihzdGFydFRpbWUpKVxyXG4gICAgICAgICAgICAgICAgICAuZm9ybWF0KCdtbVx1NTIwNnNzXHU3OUQyJyl9XHVGRjBDXHU2MjUzXHU1MzA1XHU1NDBFXHU3Njg0XHU1OTI3XHU1QzBGXHU0RTNBJHtmb3JtYXRCeXRlcyhcclxuICAgICAgICAgICAgICAgICAgICBzdW0oZmlsZUxpc3RUb3RhbCksXHJcbiAgICAgICAgICAgICAgICAgICl9XHVGRjA5YCxcclxuICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFDOUIsWUFBWSxhQUFhO0FBQ3pCLFNBQVMsZUFBZTs7O0FDSHhCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTywwQkFBMEI7QUFDakMsT0FBTyxZQUFZO0FBQ25CLE9BQU8sbUJBQW1COzs7QUNQbkIsSUFBTSx3QkFBd0I7QUFHOUIsSUFBTSxhQUFhOzs7QUNKMFYsU0FBUyxTQUFTLFlBQVk7QUFFbFosT0FBTyxXQUFXO0FBRWxCLE9BQU8sY0FBYztBQUNyQixPQUFPLFNBQVM7QUFFaEIsSUFBTSxFQUFFLE9BQU8sTUFBTSxLQUFLLElBQUk7QUFDOUIsTUFBTSxPQUFPLFFBQVE7QUFFckIsSUFBTSxnQkFBMEIsQ0FBQztBQUVqQyxTQUFTLG1CQUFtQixRQUFnQixVQUEwQjtBQUNwRSxVQUFRLFFBQVEsQ0FBQyxLQUFLLFVBQW9CO0FBQ3hDLFFB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
