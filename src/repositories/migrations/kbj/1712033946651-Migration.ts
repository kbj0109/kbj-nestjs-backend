import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712033946651 implements MigrationInterface {
    name = 'Migration1712033946651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`auths\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiredAt\` datetime NOT NULL, \`userId\` bigint NOT NULL, \`type\` varchar(255) NOT NULL, \`data\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`auths\``);
    }

}
