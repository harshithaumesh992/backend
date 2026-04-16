const User = require('../models/user');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    console.log('Fetching users from database...');
    const users = await User.find({}).select('-password');
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add user with validations
exports.addUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, permissions, address } = req.body;
    
    // Validation checks
    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push('Name should only contain letters');
    }

    // Phone validation
    if (!phone || !/^\d{10}$/.test(phone)) {
      errors.push('Phone number must be exactly 10 digits');
    }

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      } else {
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (!domain || !allowedDomains.includes(domain)) {
          errors.push('Please use a valid email provider (gmail.com, yahoo.com, etc.)');
        }
      }
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Address validation
    if (!address || address.trim().length < 10) {
      errors.push('Address must be at least 10 characters');
    }

    // Role validation
    const allowedRoles = ['user', 'admin', 'superadmin', 'order_manager'];
    if (!role || !allowedRoles.includes(role)) {
      errors.push('Invalid role selected');
    }

    // Return all validation errors
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already exists' });

    // Build user data object
    const userData = {
      name: name.trim(),
      phone,
      email: email.toLowerCase(),
      password,
      role: role || 'user',
      address: address || ''
    };

    // Add permissions if provided
    if (permissions) userData.permissions = permissions;
    
    // Create user (password will be hashed by pre-save middleware)
    const user = new User(userData);
    await user.save();
    
    const { password: pwd, ...userDataResult } = user.toObject();
    res.status(201).json(userDataResult);
  } catch (error) {
    console.error(error);
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, email, role, permissions } = req.body;
    
    const updateData = { name, phone, address, email };
    
    // Add role and permissions if provided
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;

    // Validation checks
    const errors = [];

    // Name validation
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push('Name should only contain letters');
    }

    // Phone validation
    if (!phone || !/^\d{10}$/.test(phone)) {
      errors.push('Phone number must be exactly 10 digits');
    }

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      } else {
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (!domain || !allowedDomains.includes(domain)) {
          errors.push('Please use a valid email provider (gmail.com, yahoo.com, etc.)');
        }
      }
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Address validation (optional)
    if (address && address.trim().length < 10) {
      errors.push('Address must be at least 10 characters');
    }

    // Return all validation errors
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already exists' });

    // Create user (password will be hashed by pre-save middleware)
    const user = new User({ 
      name: name.trim(), 
      phone, 
      address: address ? address.trim() : '', 
      email: email.toLowerCase(), 
      password 
    });
    console.log('Attempting to save user:', { name: user.name, email: user.email, phone: user.phone });
    await user.save();
    console.log('User saved successfully');

    res.status(201).json({ message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special case for demo admin account
    if (email === 'admin@harshicart.com' && password === 'admin123') {
      return res.json({
        message: 'Login successful',
        user: {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@harshicart.com',
          phone: '9876543210',
          address: '123 Admin Street, Admin City',
          role: 'admin',
          permissions: {
            viewProducts: true,
            viewCart: true,
            viewProfile: true,
            viewPayment: true,
            manageOrders: true,
            manageUsers: true,
            viewAnalytics: true,
            manageChat: true
          }
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Return user data (omit password but include role and permissions)
    const { password: pwd, _id, ...userData } = user.toObject();
    
    // Ensure role and permissions exist with defaults
    const responseData = {
      message: 'Login successful',
      user: {
        id: _id,  // Add MongoDB _id as id for frontend compatibility
        ...userData,
        role: userData.role || 'user',
        permissions: userData.permissions || {
          viewProducts: false,
          viewCart: false,
          viewProfile: false,
          viewPayment: false,
          manageOrders: false,
          manageUsers: false,
          viewAnalytics: false,
          manageChat: false
        }
      }
    };
    
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};