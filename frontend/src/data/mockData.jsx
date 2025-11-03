// A simple mock database for frontend development

export const mockContacts = [
  { id: 'con-1', firstName: 'Elara', lastName: 'Vance', email: 'elara.vance@stellarcorp.co', phone: '555-0101', organizationId: 'org-1', ownerId: 'user-1' },
  { id: 'con-2', firstName: 'Jaxon', lastName: 'Rider', email: 'jaxon.rider@nebula-inc.com', phone: '555-0102', organizationId: 'org-2', ownerId: 'user-2' },
  { id: 'con-3', firstName: 'Lyra', lastName: 'Celeste', email: 'lyra.c@starlight.io', phone: '555-0103', organizationId: 'org-3', ownerId: 'user-1' },
];

export const mockOrganizations = [
  { id: 'org-1', name: 'StellarCorp', industry: 'Technology', size: 500 },
  { id: 'org-2', name: 'Nebula Inc.', industry: 'Logistics', size: 120 },
  { id: 'org-3', name: 'Starlight Solutions', industry: 'Consulting', size: 45 },
];

export const mockDeals = [
  { id: 'deal-1', title: 'Project Titan API Integration', value: 25000, stage: 'Lead', organizationId: 'org-1', contactId: 'con-1' },
  { id: 'deal-2', title: 'Orion Platform Upgrade', value: 75000, stage: 'Proposal', organizationId: 'org-2', contactId: 'con-2' },
  { id: 'deal-3', title: 'Q3 Logistics Overhaul', value: 42000, stage: 'Qualification', organizationId: 'org-2', contactId: 'con-2' },
  { id: 'deal-4', title: 'Data Security Consulting', value: 15000, stage: 'Won', organizationId: 'org-3', contactId: 'con-3' },
  { id: 'deal-5', title: 'Website Redesign', value: 8000, stage: 'Lost', organizationId: 'org-1', contactId: 'con-1' },
];