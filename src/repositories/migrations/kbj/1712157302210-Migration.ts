import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712157302210 implements MigrationInterface {
    name = 'Migration1712157302210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`matchings\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fromUserId\` bigint NOT NULL, \`toUserId\` bigint NOT NULL, \`messageId\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`matchings\``);
    }

}
