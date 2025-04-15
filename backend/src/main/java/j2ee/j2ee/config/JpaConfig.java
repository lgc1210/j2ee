package j2ee.j2ee.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // Allow using @CreatedDate annotation
@Configuration
public class JpaConfig {

}
