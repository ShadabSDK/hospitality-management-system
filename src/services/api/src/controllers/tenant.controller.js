/**
 * Tenant Controller
 */

const Tenant = require('../models/Tenant');

exports.getTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, plan } = req.body;

    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { name, plan, updatedAt: Date.now() },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({ message: 'Tenant updated', tenant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBillingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({
      plan: tenant.plan,
      stripeCustomerId: tenant.stripeCustomerId,
      trialEndsAt: tenant.trialEndsAt,
      isActive: tenant.isActive
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
