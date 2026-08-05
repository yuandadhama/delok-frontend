export type Project = {
  id: string;
  name: string;
  organizationId: string;
};

export type CreateProjectInput = {
  name: string;
};

export type UpdateProjectInput = {
  name: string;
};
