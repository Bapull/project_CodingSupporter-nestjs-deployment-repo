import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1733732061117 implements MigrationInterface {
    name = 'CreateTables1733732061117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`useLanguage\` varchar(255) NULL, \`position\` int NOT NULL, \`profilePicture\` varchar(255) NOT NULL, \`googleId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`timestamp\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`link\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sender\` int NOT NULL, \`receiver\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sender\` varchar(255) NOT NULL, \`room\` int NOT NULL, \`message\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`checkInTime\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_324aad5486f8d51f2f51fa0d69\` (\`userId\`, \`checkInTime\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`incorrect_note\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mentoId\` int NULL, \`studentId\` int NOT NULL, \`errorType\` int NOT NULL, \`language\` varchar(255) NOT NULL, \`noteName\` varchar(255) NOT NULL, \`chatName\` int NULL, UNIQUE INDEX \`IDX_398faa2eccf7dd1e5a849a91be\` (\`studentId\`, \`noteName\`, \`language\`), UNIQUE INDEX \`REL_49f54e52a9a85e622fbecbb033\` (\`chatName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_02902857a6cf9df1ad2f26f321f\` FOREIGN KEY (\`room\`) REFERENCES \`chat_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_466e85b813d871bfb693f443528\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` ADD CONSTRAINT \`FK_510b2a08735f6661e752b2a0e4e\` FOREIGN KEY (\`mentoId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` ADD CONSTRAINT \`FK_dcc8dd95316ed2188a055ffec59\` FOREIGN KEY (\`studentId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` ADD CONSTRAINT \`FK_49f54e52a9a85e622fbecbb0338\` FOREIGN KEY (\`chatName\`) REFERENCES \`chat_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` DROP FOREIGN KEY \`FK_49f54e52a9a85e622fbecbb0338\``);
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` DROP FOREIGN KEY \`FK_dcc8dd95316ed2188a055ffec59\``);
        await queryRunner.query(`ALTER TABLE \`incorrect_note\` DROP FOREIGN KEY \`FK_510b2a08735f6661e752b2a0e4e\``);
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_466e85b813d871bfb693f443528\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_02902857a6cf9df1ad2f26f321f\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`DROP INDEX \`REL_49f54e52a9a85e622fbecbb033\` ON \`incorrect_note\``);
        await queryRunner.query(`DROP INDEX \`IDX_398faa2eccf7dd1e5a849a91be\` ON \`incorrect_note\``);
        await queryRunner.query(`DROP TABLE \`incorrect_note\``);
        await queryRunner.query(`DROP INDEX \`IDX_324aad5486f8d51f2f51fa0d69\` ON \`attendance\``);
        await queryRunner.query(`DROP TABLE \`attendance\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`chat_room\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
