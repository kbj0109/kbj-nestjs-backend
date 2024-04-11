import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712152012663 implements MigrationInterface {
    name = 'Migration1712152012663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`fromUserId\` bigint NOT NULL, \`toUserId\` bigint NOT NULL, \`messageLevel\` int NOT NULL, \`messageStatus\` varchar(255) NOT NULL, \`text\` text NOT NULL, \`reason\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
