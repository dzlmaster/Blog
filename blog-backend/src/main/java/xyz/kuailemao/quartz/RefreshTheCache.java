package xyz.kuailemao.quartz;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 每5分钟刷新常用数据缓存（Spring原生定时任务，无需数据库）
 */
@Component // 交给Spring管理
public class RefreshTheCache {

    /**
     * 定时任务：每 5 分钟执行一次
     * fixedRate = 5 * 60 * 1000 毫秒 = 5分钟
     */
    @Scheduled(fixedRate = 300000)
    public void execute() {
        // 👇 这里写你原本的缓存刷新逻辑
        System.out.println("定时任务执行：每5分钟刷新常用数据缓存");
        // 你原本的业务代码直接粘贴在这里
    }
}