import { prisma } from "./src/lib/prisma.js"

// Test if Setting model is accessible
async function testSetting() {
    try {
        const count = await prisma.setting.count()
        console.log("Setting model accessible, count:", count)
    } catch (error) {
        console.error("Setting model not accessible:", error)
    }
}

// Test the connection
testSetting()
