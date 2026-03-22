// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/vite@4.5.9_@types+node@22.13.5_sass@1.85.1_terser@5.39.0/node_modules/vite/dist/node/index.js";
import AutoImport from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/unplugin-auto-import@0.16.7_2ba77fc2c30ceca65904959fd325986c/node_modules/unplugin-auto-import/dist/vite.js";
import viteCompression from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/vite-plugin-compression@0.5_968f2296fbb40d5eb58c822cb2441a47/node_modules/vite-plugin-compression/dist/index.mjs";
import Components from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/unplugin-vue-components@0.2_63719d70d6d64ccae630064dde098806/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/unplugin-vue-components@0.2_63719d70d6d64ccae630064dde098806/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { visualizer } from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@3.29.5/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import vue from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vi_1f6b691c2c2c16e96d445471ff55d165/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_53079cc3247f9cbbe8abbdcfb6ec48e6/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/tailwindcss@3.4.17/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///D:/gitcode/ruyu-blog/blog-frontend/kuailemao-blog/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.5.3/node_modules/autoprefixer/lib/autoprefixer.js";
var vite_config_default = defineConfig(({ mode }) => {
  return {
    plugins: [
      viteCompression({
        verbose: true,
        // 是否在控制台中输出压缩结果
        disable: false,
        threshold: 1024,
        // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: "gzip",
        // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: ".gz",
        // 源文件压缩后是否删除(亲测配置为true后浏览器会出现错误，除非nginx配置index  index.html index.htm;)
        // 具体出现问题参考：https://blog.csdn.net/zzk_01/article/details/125857217
        deleteOriginFile: false
      }),
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      }),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        resolvers: [ElementPlusResolver()],
        dts: "src/types/auto-imports.d.ts"
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "src/types/components.d.ts"
      }),
      // 打包体积分析
      visualizer({
        open: true,
        filename: "visualizer.html"
        //分析图生成的文件名
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")
        // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      },
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer
        ]
      }
    },
    build: {
      rollupOptions: {
        // 配置打包文件分类输出
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          // 引入文件名的名称
          entryFileNames: "js/[name]-[hash].js",
          // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]"
          // 资源文件像 字体，图片等
        },
        // 最小化拆分包， 将需要分离的包单独的打包出来
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
    server: {
      port: 99,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: `${loadEnv(mode, process.cwd()).VITE_SERVE}`,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        },
        ...loadEnv(mode, process.cwd()).VITE_MUSIC_SERVE ? {
          "/wapi": {
            target: `${loadEnv(mode, process.cwd()).VITE_MUSIC_SERVE}`,
            changeOrigin: true,
            rewrite: (path2) => path2.replace(/^\/wapi/, "")
          }
        } : {}
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxnaXRjb2RlXFxcXHJ1eXUtYmxvZ1xcXFxibG9nLWZyb250ZW5kXFxcXGt1YWlsZW1hby1ibG9nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxnaXRjb2RlXFxcXHJ1eXUtYmxvZ1xcXFxibG9nLWZyb250ZW5kXFxcXGt1YWlsZW1hby1ibG9nXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9naXRjb2RlL3J1eXUtYmxvZy9ibG9nLWZyb250ZW5kL2t1YWlsZW1hby1ibG9nL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtDb25maWdFbnYsIGRlZmluZUNvbmZpZywgbG9hZEVudn0gZnJvbSAndml0ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7RWxlbWVudFBsdXNSZXNvbHZlcn0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuLy8gXHU1RjE1XHU1MTY1c3ZnXHU5NzAwXHU4OTgxXHU3NTI4XHU1MjMwXHU2M0QyXHU0RUY2XHJcbmltcG9ydCB7Y3JlYXRlU3ZnSWNvbnNQbHVnaW59IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH06IENvbmZpZ0VudikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgICAgICAgICAgICB2ZXJib3NlOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU3MjhcdTYzQTdcdTUyMzZcdTUzRjBcdTRFMkRcdThGOTNcdTUxRkFcdTUzOEJcdTdGMjlcdTdFRDNcdTY3OUNcclxuICAgICAgICAgICAgICAgIGRpc2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiAxMDI0LCAvLyBcdTU5ODJcdTY3OUNcdTRGNTNcdTc5RUZcdTU5MjdcdTRFOEVcdTk2MDhcdTUwM0NcdUZGMENcdTVDMDZcdTg4QUJcdTUzOEJcdTdGMjlcdUZGMENcdTUzNTVcdTRGNERcdTRFM0FiXHVGRjBDXHU0RjUzXHU3OUVGXHU4RkM3XHU1QzBGXHU2NUY2XHU4QkY3XHU0RTBEXHU4OTgxXHU1MzhCXHU3RjI5XHVGRjBDXHU0RUU1XHU1MTREXHU5MDAyXHU1Rjk3XHU1MTc2XHU1M0NEXHJcbiAgICAgICAgICAgICAgICBhbGdvcml0aG06ICdnemlwJywgLy8gXHU1MzhCXHU3RjI5XHU3Qjk3XHU2Q0Q1XHVGRjBDXHU1M0VGXHU5MDA5WydnemlwJ1x1RkYwQycgYnJvdGxpY2NvbXByZXNzICdcdUZGMEMnZGVmbGF0ZSAnXHVGRjBDJ2RlZmxhdGVSYXcnXVxyXG4gICAgICAgICAgICAgICAgZXh0OiAnLmd6JyxcclxuICAgICAgICAgICAgICAgIC8vIFx1NkU5MFx1NjU4N1x1NEVGNlx1NTM4Qlx1N0YyOVx1NTQwRVx1NjYyRlx1NTQyNlx1NTIyMFx1OTY2NChcdTRFQjJcdTZENEJcdTkxNERcdTdGNkVcdTRFM0F0cnVlXHU1NDBFXHU2RDRGXHU4OUM4XHU1NjY4XHU0RjFBXHU1MUZBXHU3M0IwXHU5NTE5XHU4QkVGXHVGRjBDXHU5NjY0XHU5NzVFbmdpbnhcdTkxNERcdTdGNkVpbmRleCAgaW5kZXguaHRtbCBpbmRleC5odG07KVxyXG4gICAgICAgICAgICAgICAgLy8gXHU1MTc3XHU0RjUzXHU1MUZBXHU3M0IwXHU5NUVFXHU5ODk4XHU1M0MyXHU4MDAzXHVGRjFBaHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3p6a18wMS9hcnRpY2xlL2RldGFpbHMvMTI1ODU3MjE3XHJcbiAgICAgICAgICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgdnVlKCksXHJcbiAgICAgICAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICAgICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1OTcwMFx1ODk4MVx1N0YxM1x1NUI1OFx1NzY4NFx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVxyXG4gICAgICAgICAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXHJcbiAgICAgICAgICAgICAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxyXG4gICAgICAgICAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICAgICAgICAgICAgICBkdHM6IFwic3JjL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzXCIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXHJcbiAgICAgICAgICAgICAgICBkdHM6IFwic3JjL3R5cGVzL2NvbXBvbmVudHMuZC50c1wiLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgLy8gXHU2MjUzXHU1MzA1XHU0RjUzXHU3OUVGXHU1MjA2XHU2NzkwXHJcbiAgICAgICAgICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICAgICAgICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiAndmlzdWFsaXplci5odG1sJyAvL1x1NTIwNlx1Njc5MFx1NTZGRVx1NzUxRlx1NjIxMFx1NzY4NFx1NjU4N1x1NEVGNlx1NTQwRFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShcIi4vc3JjXCIpIC8vIFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFx1OTE0RFx1N0Y2RVx1RkYwQ1x1NEY3Rlx1NzUyOCBAIFx1NEVFM1x1NjZGRiBzcmNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY3NzOiB7XHJcbiAgICAgICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCIuL3NyYy9zdHlsZXMvdmFyaWFibGUuc2Nzc1wiOycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3N0Y3NzOiB7XHJcbiAgICAgICAgICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgdGFpbHdpbmRjc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3ByZWZpeGVyLFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTUyMDZcdTdDN0JcdThGOTNcdTUxRkFcclxuICAgICAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsIC8vIFx1NUYxNVx1NTE2NVx1NjU4N1x1NEVGNlx1NTQwRFx1NzY4NFx1NTQwRFx1NzlGMFxyXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsIC8vIFx1NTMwNVx1NzY4NFx1NTE2NVx1NTNFM1x1NjU4N1x1NEVGNlx1NTQwRFx1NzlGMFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsIC8vIFx1OEQ0NFx1NkU5MFx1NjU4N1x1NEVGNlx1NTBDRiBcdTVCNTdcdTRGNTNcdUZGMENcdTU2RkVcdTcyNDdcdTdCNDlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBcdTY3MDBcdTVDMEZcdTUzMTZcdTYyQzZcdTUyMDZcdTUzMDVcdUZGMEMgXHU1QzA2XHU5NzAwXHU4OTgxXHU1MjA2XHU3OUJCXHU3Njg0XHU1MzA1XHU1MzU1XHU3MkVDXHU3Njg0XHU2MjUzXHU1MzA1XHU1MUZBXHU2NzY1XHJcbiAgICAgICAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgICAgIHBvcnQ6IDk5LFxyXG4gICAgICAgICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGAke2xvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSkuVklURV9TRVJWRX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLi4uKGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSkuVklURV9NVVNJQ19TRVJWRSA/IHtcclxuICAgICAgICAgICAgICAgICAgICAnL3dhcGknOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogYCR7bG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKS5WSVRFX01VU0lDX1NFUlZFfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3dhcGkvLCAnJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IDoge30pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1UsU0FBbUIsY0FBYyxlQUFjO0FBQzlYLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEsMkJBQTBCO0FBQ2xDLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sU0FBUztBQUVoQixTQUFRLDRCQUEyQjtBQUNuQyxPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFHekIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQWlCO0FBQ2pELFNBQU87QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNMLGdCQUFnQjtBQUFBLFFBQ1osU0FBUztBQUFBO0FBQUEsUUFDVCxTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUE7QUFBQSxRQUNYLFdBQVc7QUFBQTtBQUFBLFFBQ1gsS0FBSztBQUFBO0FBQUE7QUFBQSxRQUdMLGtCQUFrQjtBQUFBLE1BQ3RCLENBQUM7QUFBQSxNQUNELElBQUk7QUFBQSxNQUNKLHFCQUFxQjtBQUFBO0FBQUEsUUFFakIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUFBO0FBQUEsUUFFMUQsVUFBVTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1AsU0FBUyxDQUFDLE9BQU8sY0FBYyxPQUFPO0FBQUEsUUFDdEMsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsUUFDakMsS0FBSztBQUFBLE1BQ1QsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1AsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsUUFDakMsS0FBSztBQUFBLE1BQ1QsQ0FBQztBQUFBO0FBQUEsTUFFRCxXQUFXO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNkLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDSCxLQUFLLEtBQUssUUFBUSxPQUFPO0FBQUE7QUFBQSxNQUM3QjtBQUFBLElBQ0o7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNELHFCQUFxQjtBQUFBLFFBQ2pCLE1BQU07QUFBQSxVQUNGLG1CQUFtQjtBQUFBLFVBQ25CLGdCQUFnQjtBQUFBLFFBQ3BCO0FBQUEsTUFDSjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ0wsU0FBUztBQUFBLFVBQ0w7QUFBQSxVQUNBO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCxlQUFlO0FBQUE7QUFBQSxRQUVYLFFBQVE7QUFBQSxVQUNKLGdCQUFnQjtBQUFBO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUE7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQTtBQUFBLFFBQ3BCO0FBQUE7QUFBQSxRQUVBLGFBQWEsSUFBSTtBQUNiLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUM3QixtQkFBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVM7QUFBQSxVQUMxRTtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0gsUUFBUTtBQUFBLFVBQ0osUUFBUSxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQyxFQUFFLFVBQVU7QUFBQSxVQUNsRCxjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUNoRDtBQUFBLFFBQ0EsR0FBSSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRSxtQkFBbUI7QUFBQSxVQUNoRCxTQUFTO0FBQUEsWUFDTCxRQUFRLEdBQUcsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUUsZ0JBQWdCO0FBQUEsWUFDeEQsY0FBYztBQUFBLFlBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsV0FBVyxFQUFFO0FBQUEsVUFDakQ7QUFBQSxRQUNKLElBQUksQ0FBQztBQUFBLE1BQ1Q7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
