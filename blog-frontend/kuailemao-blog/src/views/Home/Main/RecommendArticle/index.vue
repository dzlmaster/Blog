<script setup lang="ts">
import { getRecommendArticleList, getArticleList } from "@/apis/home";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RecommendArticle {
  id: number | string;
  articleTitle: string;
  articleContent: string;
  articleCover: string;
  createTime: string;
}

const recommendArticles = ref<RecommendArticle[]>([])
const loading = ref(false)

const modules = ref([Navigation,Pagination,Autoplay]);

function loadContent(){
  loading.value = true
  console.log('[推荐栏] 开始加载数据...')
  getRecommendArticleList().then(res => {
    console.log('[推荐栏] API 完整响应:', JSON.stringify(res, null, 2))
    console.log('[推荐栏] res 类型:', typeof res)
    console.log('[推荐栏] res.data 类型:', typeof res?.data)
    console.log('[推荐栏] res.data 是否为数组:', Array.isArray(res?.data))
    console.log('[推荐栏] res.data 值:', res?.data)
    
    // 尝试多种可能的数据结构
    let articles = []
    
    if (res && res.data) {
      if (Array.isArray(res.data)) {
        articles = res.data
      } else if (res.data.data && Array.isArray(res.data.data)) {
        articles = res.data.data
        console.log('[推荐栏] 数据在 res.data.data 中')
      } else if (res.data.list && Array.isArray(res.data.list)) {
        articles = res.data.list
        console.log('[推荐栏] 数据在 res.data.list 中')
      }
    }
    
    console.log('[推荐栏] 提取到的文章数组，长度:', articles.length)
    
    if (articles.length > 0) {
      // 过滤内容
      articles = articles.map((item: any) => {
        if (item.articleContent) {
          item.articleContent = item.articleContent.replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '')
          // 提取前 50 个字符
          item.articleContent = item.articleContent.substring(0, 25) + '...';
        }
        return item;
      });
      recommendArticles.value = articles
      console.log('[推荐栏] 设置 recommendArticles:', recommendArticles.value)
      console.log('[推荐栏] 文章数量:', recommendArticles.value.length)
      console.log('[推荐栏] 是否启用自动播放:', recommendArticles.value.length > 1)
    } else {
      console.warn('[推荐栏] 推荐文章为空，尝试使用最新文章作为推荐')
      // 如果推荐文章为空，使用最新文章作为推荐（最多5篇）
      getArticleList(1, 5).then((articleRes: any) => {
        console.log('[推荐栏] 最新文章API返回:', articleRes)
        if (articleRes && articleRes.code === 200 && articleRes.data && articleRes.data.page && Array.isArray(articleRes.data.page)) {
          const latestArticles = articleRes.data.page.map((item: any) => {
            if (item.articleContent) {
              item.articleContent = item.articleContent.replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '')
              item.articleContent = item.articleContent.substring(0, 25) + '...';
            }
            return item;
          });
          recommendArticles.value = latestArticles
          console.log('[推荐栏] 使用最新文章作为推荐，数量:', latestArticles.length)
        } else {
          console.warn('[推荐栏] 无法获取最新文章，推荐栏将不显示')
          console.warn('[推荐栏] 最新文章API返回结构:', articleRes)
          recommendArticles.value = []
        }
      }).catch(err => {
        console.error('[推荐栏] 获取最新文章失败:', err)
        recommendArticles.value = []
      })
    }
  }).catch(err => {
    console.error('[推荐栏] 获取推荐文章失败:', err)
    console.error('[推荐栏] 错误详情:', err.response || err.message)
    recommendArticles.value = []
  }).finally(() => {
    loading.value = false
    console.log('[推荐栏] 加载完成，loading:', loading.value)
  })
}

</script>

<template>
  <div>
    <el-divider border-style="dashed" content-position="left">
      <div class="flex items-center">
        <SvgIcon name="recommend" color="#409EFF" class="icon"/>
        <span class="ml-[5px]">推荐</span>
      </div>
    </el-divider>
  </div>
  <div v-view-request="{ callback: loadContent }">
    <!-- 加载中 -->
    <el-skeleton v-if="loading" :rows="5" animated />
    
    <!-- 有数据时显示轮播 -->
    <swiper 
      v-else-if="recommendArticles.length > 0"
      class="recommend-swiper"
      :modules="modules"
      :loop="recommendArticles.length > 1"
      :navigation="true"
      :pagination="{ clickable: true }"
      :autoplay="recommendArticles.length > 1 ? { delay: 2500, disableOnInteraction: false } : false"
      :space-between="0"
      @swiper="(swiper) => { console.log('[推荐栏] Swiper 初始化:', swiper); console.log('[推荐栏] Autoplay 状态:', swiper.autoplay); }"
    >
      <swiper-slide 
        v-for="recommendArticle in recommendArticles" 
        :key="recommendArticle.id"
        class="recommend-slide"
        @click="$router.push(`/article/${recommendArticle.id}`)"
      >
        <el-image 
          :src="recommendArticle.articleCover"
          fit="cover"
          class="recommend-bg-image"
          :alt="recommendArticle.articleTitle"
        />
        <div class="item_text">
          <div class="title">{{ recommendArticle.articleTitle }}</div>
          <div class="time">{{ recommendArticle.createTime }}</div>
          <div class="content">{{ recommendArticle.articleContent }}</div>
        </div>
      </swiper-slide>
    </swiper>
    
    <!-- 无数据时显示骨架屏 -->
    <el-skeleton v-else :rows="5" animated />
  </div>
</template>

<style scoped lang="scss">
.recommend-swiper {
  width: 100%;
  height: 200px;
  border-radius: $border-radius;
  overflow: hidden;
  cursor: pointer;
  
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    
    &:after {
      font-size: 18px;
    }
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  
  :deep(.swiper-pagination-bullet) {
    background-color: #fff;
    opacity: 0.5;
    
    &.swiper-pagination-bullet-active {
      opacity: 1;
    }
  }
}

.recommend-slide {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

// 背景图片
.recommend-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  :deep(.el-image__inner) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  // 屏幕大于768时
  @media screen and (min-width: 768px) {
    :deep(.el-image__inner) {
      transform: translate(0, -20%);
    }
  }
}

.item_text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  font-weight: bold;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  padding: 20px;
  z-index: 1;
  text-align: center;
  
  .title {
    font-size: 30px;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
  }
  
  .time {
    font-size: 15px;
    margin-bottom: 10px;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .content {
    font-size: 18px;
    opacity: 0.95;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    line-height: 1.5;
  }
  
  @media screen and (max-width: 768px) {
    .title {
      font-size: 24px;
    }
    
    .time {
      font-size: 13px;
    }
    
    .content {
      font-size: 16px;
    }
  }
}
</style>