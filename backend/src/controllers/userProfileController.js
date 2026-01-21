const { prisma } = require("../config/db");
const bcryptjs = require("bcryptjs");

// ==================== USER PROFILE ====================

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true,
        createdAt: true,
        addresses: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profilePicture } = req.body;

    if (!name && !profilePicture) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(profilePicture && { profilePicture })
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true
      }
    });

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Check if old password is correct
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true }
    });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADDRESS MANAGEMENT ====================

exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, city, zip, phone, isDefault } = req.body;

    if (!address || !city || !zip || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // If isDefault is true, unset other addresses as default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        address,
        city,
        zip,
        phone,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({ success: true, address: newAddress, message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { address, city, zip, phone, isDefault } = req.body;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // If isDefault is true, unset other addresses as default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: parseInt(id) } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        ...(address && { address }),
        ...(city && { city }),
        ...(zip && { zip }),
        ...(phone && { phone }),
        ...(isDefault !== undefined && { isDefault })
      }
    });

    res.json({ success: true, address: updatedAddress, message: "Address updated successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await prisma.address.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Unset other addresses as default
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });

    // Set this address as default
    const address = await prisma.address.update({
      where: { id: parseInt(id) },
      data: { isDefault: true }
    });

    res.json({ success: true, address, message: "Default address updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
