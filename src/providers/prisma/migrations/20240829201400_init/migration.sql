-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `url` (
    `id` CHAR(36) NOT NULL,
    `original_url` VARCHAR(191) NOT NULL,
    `short_url` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,
    `click_count` INTEGER NOT NULL DEFAULT 0,
    `userId` CHAR(36) NULL,

    UNIQUE INDEX `url_short_url_key`(`short_url`),
    INDEX `url_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `url` ADD CONSTRAINT `url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
