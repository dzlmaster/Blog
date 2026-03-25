package xyz.kuailemao;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.quartz.QuartzAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@MapperScan("xyz.kuailemao.mapper")
@SpringBootApplication(exclude = QuartzAutoConfiguration.class)
@EnableMethodSecurity
@EnableScheduling
@Slf4j
public class BlogBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogBackendApplication.class, args);

        log.info(
                """
                \n
                ---------------------------------------------------------恭喜你成功启动后端---------------------------------------------------------
                  _____                          _     _
                 |  __ \\                        | |   | |           \s
                 | |__) |   _ _   _ _   _ ______| |__ | | ___   __ _\s
                 |  _  / | | | | | | | | |______| '_ \\| |/ _ \\ / _` |
                 | | \\ \\ |_| | |_| | |_| |      | |_) | | (_) | (_| |
                 |_|  \\_\\__,_|\\__, |\\__,_|      |_.__/|_|\\___/ \\__, |
                               __/ |                            __/ |
                              |___/                            |___/


                """
        );
    }
}
