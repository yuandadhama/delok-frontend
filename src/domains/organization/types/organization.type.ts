export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrganizationInput = {
  name: string;
};

export type UpdateOrganizationInput = {
  name: string;
};
