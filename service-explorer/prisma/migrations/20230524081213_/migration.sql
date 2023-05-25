-- CreateTable
CREATE TABLE `resource` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `size` BIGINT NULL DEFAULT 0,
    `type` INTEGER NOT NULL,
    `suffix` VARCHAR(10) NULL,
    `parent_id` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `creator_id` VARCHAR(191) NOT NULL,

    INDEX `resource_path_idx`(`path`),
    INDEX `resource_size_idx`(`size`),
    INDEX `resource_type_idx`(`type`),
    INDEX `resource_parent_id_idx`(`parent_id`),
    INDEX `resource_create_time_idx`(`create_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `resource` ADD CONSTRAINT `resource_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `resource`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
