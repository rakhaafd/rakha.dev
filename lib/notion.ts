import { Client } from "@notionhq/client";

const notionApiKey = process.env.NOTION_API_KEY;
const skillsDbId = process.env.NOTION_SKILLS_DB_ID || process.env.NOTION_SKILLS_DB;
const projectsDbId = process.env.NOTION_PROJECTS_DB_ID || process.env.NOTION_PROJECTS_DB;
const certificatesDbId = process.env.NOTION_CERTIFICATES_DB_ID || process.env.NOTION_CERTIFICATES_DB;

export const notion = notionApiKey ? new Client({ auth: notionApiKey }) : null;

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  published: boolean;
}

export interface SkillGroup {
  category: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  details: string;
  role: string;
  type: string;
  techStack: string[];
  github: string;
  link: string;
  image: string;
  images: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string[];
  credentialUrl: string;
  details: string;
  published: boolean;
  order: number;
}

export async function getSkillsFromNotion(): Promise<SkillGroup[]> {
  if (!notion || !skillsDbId) {
    console.warn("Notion API Key or Skills Database ID missing in env.local.");
    return [];
  }

  try {
    let rawResults: any[] = [];

    if ("dataSources" in notion && typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: skillsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    } else if ("databases" in notion && typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: skillsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    }

    const skills: SkillItem[] = rawResults
      .map((page: any) => {
        const props = page.properties;
        const name = props.Name?.title?.[0]?.plain_text || props.name?.title?.[0]?.plain_text || "";
        const category = props.Category?.select?.name || props.category?.select?.name || "Uncategorized";
        const icon = props.Icon?.rich_text?.[0]?.plain_text || props.icon?.rich_text?.[0]?.plain_text || "";
        const order = props.Order?.number ?? props.order?.number ?? 99;
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;

        return {
          id: page.id,
          name,
          category,
          icon,
          order,
          published,
        };
      })
      .filter((s) => s.name && s.published);

    const groupedMap = new Map<string, SkillItem[]>();

    skills.forEach((skill) => {
      if (!groupedMap.has(skill.category)) {
        groupedMap.set(skill.category, []);
      }
      groupedMap.get(skill.category)!.push(skill);
    });

    return Array.from(groupedMap.entries()).map(([category, skills]) => ({
      category,
      skills,
    }));
  } catch (error: any) {
    console.error("Error fetching skills from Notion:", error?.message || error);
    return [];
  }
}

export async function getProjectsFromNotion(): Promise<ProjectItem[]> {
  if (!notion || !projectsDbId) {
    console.warn("Notion API Key or Projects Database ID missing in env.local.");
    return [];
  }

  try {
    let rawResults: any[] = [];

    if ("dataSources" in notion && typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: projectsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    } else if ("databases" in notion && typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: projectsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    }

    return rawResults
      .map((page: any) => {
        const props = page.properties;
        const title = props.Title?.title?.[0]?.plain_text || props.title?.title?.[0]?.plain_text || "";
        const description = props.Description?.rich_text?.[0]?.plain_text || props.description?.rich_text?.[0]?.plain_text || "";
        const details = props.Details?.rich_text?.[0]?.plain_text || props.details?.rich_text?.[0]?.plain_text || "";
        const role = props.Role?.select?.name || props.role?.select?.name || "";
        const type = props.Type?.select?.name || props.type?.select?.name || "";
        const techStack = (props.TechStack?.multi_select || props.techStack?.multi_select || []).map((t: any) => t.name);
        const github = props.Github?.url || props.github?.url || "";
        const link = props.Link?.url || props.link?.url || "";

        // Extract single or multiple image URLs
        const imageProp = props.Image || props.image;
        let images: string[] = [];

        if (imageProp) {
          if (imageProp.type === "url" && imageProp.url) {
            images = imageProp.url.split(",").map((s: string) => s.trim()).filter(Boolean);
          } else if (imageProp.type === "rich_text" && imageProp.rich_text?.length > 0) {
            const fullText = imageProp.rich_text[0].plain_text || "";
            images = fullText.split(",").map((s: string) => s.trim()).filter(Boolean);
          } else if (imageProp.type === "files" && imageProp.files?.length > 0) {
            images = imageProp.files.map((f: any) => f.file?.url || f.external?.url || "").filter(Boolean);
          }
        }

        const image = images[0] || "";
        const featured = props.Featured?.checkbox ?? props.featured?.checkbox ?? true;
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;
        const order = props.Order?.number ?? props.order?.number ?? 99;

        return {
          id: page.id,
          title,
          description,
          details,
          role,
          type,
          techStack,
          github,
          link,
          image,
          images,
          featured,
          published,
          order,
        };
      })
      .filter((p) => p.title && p.published);
  } catch (error: any) {
    console.error("Error fetching projects from Notion:", error?.message || error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ProjectItem | null> {
  const projects = await getProjectsFromNotion();
  const cleanId = id.replace(/-/g, "");
  return projects.find((p) => p.id === id || p.id.replace(/-/g, "") === cleanId) || null;
}

export async function getCertificatesFromNotion(): Promise<CertificateItem[]> {
  if (!notion || !certificatesDbId) {
    console.warn("Notion API Key or Certificates Database ID missing in env.local.");
    return [];
  }

  try {
    let rawResults: any[] = [];

    if ("dataSources" in notion && typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: certificatesDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    } else if ("databases" in notion && typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: certificatesDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    }

    return rawResults
      .map((page: any) => {
        const props = page.properties;
        const title = props.Title?.title?.[0]?.plain_text || props.title?.title?.[0]?.plain_text || "";
        const issuer = props.Issuer?.rich_text?.[0]?.plain_text || props.issuer?.rich_text?.[0]?.plain_text || props.Issuer?.select?.name || "";
        const date = props.Date?.rich_text?.[0]?.plain_text || props.date?.rich_text?.[0]?.plain_text || props.Date?.date?.start || "";
        const category = (props.Category?.multi_select || props.category?.multi_select || []).map((c: any) => c.name);
        const credentialUrl = props.CredentialURL?.url || props.credentialUrl?.url || props.Link?.url || props.link?.url || "";
        const details = props.Details?.rich_text?.[0]?.plain_text || props.details?.rich_text?.[0]?.plain_text || "";
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;
        const order = props.Order?.number ?? props.order?.number ?? 99;

        return {
          id: page.id,
          title,
          issuer,
          date,
          category,
          credentialUrl,
          details,
          published,
          order,
        };
      })
      .filter((c) => c.title && c.published);
  } catch (error: any) {
    console.error("Error fetching certificates from Notion:", error?.message || error);
    return [];
  }
}
