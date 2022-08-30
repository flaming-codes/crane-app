export type ExportedLicense = {
  licenseType: string;
  name: string;
  // Might be raw 'git+...'-link.
  link: string;
  remoteVersion: string;
  installedVersion: string;
  definedVersion: string;
  author: string;

  department?: string;
  relatedTo?: string;
  licensePeriod?: string;
  material?: string;
};
