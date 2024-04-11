import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712414348800 implements MigrationInterface {
    name = 'Migration1712414348800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matchings\` ADD \`userId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matchings\` ADD \`matchingUserId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matchings\` CHANGE \`fromUserId\` \`fromUserId\` bigint UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`matchings\` CHANGE \`toUserId\` \`toUserId\` bigint UNSIGNED NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matchings\` CHANGE \`toUserId\` \`toUserId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matchings\` CHANGE \`fromUserId\` \`fromUserId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matchings\` DROP COLUMN \`matchingUserId\``);
        await queryRunner.query(`ALTER TABLE \`matchings\` DROP COLUMN \`userId\``);
    }

}
