import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seed script for EMS database
 * 
 * Creates:
 * - 1 admin user
 * - 5 sample employees
 * 
 * Usage:
 * npm run db:seed
 */
async function main() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data (optional - comment out if you want to keep data)
    console.log("🗑️  Clearing existing data...");
    await prisma.employee.deleteMany({});
    await prisma.user.deleteMany({});

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.create({
      data: {
        email: "admin@ems.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@123`);
    console.log("   ⚠️  Please change the password after first login!\n");

    // Create sample employees
    console.log("👥 Creating sample employees...");
    const employees = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0101",
        department: "Engineering",
        position: "Senior Software Engineer",
        salary: 150000,
        status: "ACTIVE",
        createdByUserId: admin.id,
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1-555-0102",
        department: "Product",
        position: "Product Manager",
        salary: 140000,
        status: "ACTIVE",
        createdByUserId: admin.id,
      },
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@example.com",
        phone: "+1-555-0103",
        department: "Engineering",
        position: "DevOps Engineer",
        salary: 130000,
        status: "ACTIVE",
        createdByUserId: admin.id,
      },
      {
        firstName: "Emily",
        lastName: "Williams",
        email: "emily.williams@example.com",
        phone: "+1-555-0104",
        department: "Sales",
        position: "Sales Manager",
        salary: 120000,
        status: "ACTIVE",
        createdByUserId: admin.id,
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@example.com",
        phone: "+1-555-0105",
        department: "HR",
        position: "HR Specialist",
        salary: 85000,
        status: "ACTIVE",
        createdByUserId: admin.id,
      },
    ];

    const createdEmployees = await Promise.all(
      employees.map((emp) =>
        prisma.employee.create({
          data: emp,
        })
      )
    );

    console.log(`✅ Created ${createdEmployees.length} sample employees`);
    createdEmployees.forEach((emp) => {
      console.log(`   - ${emp.firstName} ${emp.lastName} (${emp.email})`);
    });

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log(`   Email: admin@ems.com`);
    console.log(`   Password: Admin@123`);
    console.log("\n💡 Next steps:");
    console.log("   1. Start the development server: npm run dev");
    console.log("   2. Open http://localhost:3000/login");
    console.log("   3. Login with the credentials above");
    console.log("   4. Navigate to /dashboard/employees to manage employees");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

