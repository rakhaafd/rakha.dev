import { Client } from "@notionhq/client";
import { NotionTextSegment } from "@/components/ui/notion-text";

const notionApiKey = process.env.NOTION_API_KEY;
const profileDbId = process.env.NOTION_PROFILE_DB_ID || process.env.NOTION_PROFILE_DB;
const socialsDbId = process.env.NOTION_SOCIALS_DB_ID || process.env.NOTION_SOCIALS_DB;
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
  descriptionSegments?: NotionTextSegment[];
  details: string;
  detailsSegments?: NotionTextSegment[];
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
  detailsSegments?: NotionTextSegment[];
  published: boolean;
  order: number;
}

export interface SocialItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
  published: boolean;
}

export interface ProfileItem {
  name: string;
  tagline: string;
  taglineSegments: NotionTextSegment[];
  banner: string;
  bio: string;
  bioSegments: NotionTextSegment[];
  resumeUrl: string;
  email: string;
}

function parseRichTextSegments(rawArray: any[]): NotionTextSegment[] {
  if (!rawArray || !Array.isArray(rawArray)) return [];
  return rawArray.map((t: any) => ({
    plain_text: t.plain_text || "",
    annotations: t.annotations,
    href: t.href,
  }));
}

export async function getProfileFromNotion(): Promise<ProfileItem | null> {
  if (!notion || !profileDbId) {
    return null;
  }

  try {
    let rawResults: any[] = [];

    if ("dataSources" in notion && typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: profileDbId,
      });
      rawResults = response.results;
    } else if ("databases" in notion && typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: profileDbId,
      });
      rawResults = response.results;
    }

    if (!rawResults || rawResults.length === 0) return null;

    const props = rawResults[0].properties;

    const name = props.Name?.title?.[0]?.plain_text || props.name?.title?.[0]?.plain_text || "Rakha Fausta Adinata Raharja";
    
    const taglineRaw = props.Tagline?.rich_text || props.tagline?.rich_text || [];
    const taglineSegments = parseRichTextSegments(taglineRaw);
    const tagline = taglineSegments.map((t) => t.plain_text).join("") || "Software Engineer Wannabe.";

    const banner = props.Banner?.url || props.banner?.url || "/images/banner.jpeg";
    
    const bioRaw = props.Bio?.rich_text || props.bio?.rich_text || [];
    const bioSegments = parseRichTextSegments(bioRaw);
    const bio = bioSegments.map((t) => t.plain_text).join("") || "";

    const resumeUrl = props.ResumeUrl?.url || props.resumeUrl?.url || props.ResumeURL?.url || "";
    const email = props.Email?.email || props.email?.email || props.Email?.rich_text?.[0]?.plain_text || "";

    return {
      name,
      tagline,
      taglineSegments,
      banner,
      bio,
      bioSegments,
      resumeUrl,
      email,
    };
  } catch (error: any) {
    console.error("Error fetching profile from Notion:", error?.message || error);
    return null;
  }
}

export async function getSocialsFromNotion(): Promise<SocialItem[]> {
  if (!notion || !socialsDbId) {
    return [];
  }

  try {
    let rawResults: any[] = [];

    if ("dataSources" in notion && typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: socialsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    } else if ("databases" in notion && typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: socialsDbId,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      rawResults = response.results;
    }

    return rawResults
      .map((page: any) => {
        const props = page.properties;
        const name = props.Name?.title?.[0]?.plain_text || props.name?.title?.[0]?.plain_text || "";
        const url = props.Url?.url || props.url?.url || props.Link?.url || props.link?.url || "";
        const icon = props.Icon?.rich_text?.[0]?.plain_text || props.icon?.rich_text?.[0]?.plain_text || "";
        const order = props.Order?.number ?? props.order?.number ?? 99;
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;

        return {
          id: page.id,
          name,
          url,
          icon,
          order,
          published,
        };
      })
      .filter((s) => s.name && s.url && s.published);
  } catch (error: any) {
    console.error("Error fetching socials from Notion:", error?.message || error);
    return [];
  }
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

    const items: SkillItem[] = rawResults.map((page: any) => {
      const props = page.properties;
      const name = props.Name?.title?.[0]?.plain_text || props.name?.title?.[0]?.plain_text || "";
      const category = props.Category?.select?.name || props.category?.select?.name || "Other";
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
    });

    const activeSkills = items.filter((s) => s.name && s.published);

    const groupedMap = new Map<string, SkillItem[]>();
    activeSkills.forEach((skill) => {
      if (!groupedMap.has(skill.category)) {
        groupedMap.set(skill.category, []);
      }
      groupedMap.get(skill.category)!.push(skill);
    });

    return Array.from(groupedMap.entries()).map(([category, skills]) => ({
      category,
      skills: skills.sort((a, b) => a.order - b.order),
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
        
        const descRaw = props.Description?.rich_text || props.description?.rich_text || [];
        const descriptionSegments = parseRichTextSegments(descRaw);
        const description = descriptionSegments.map((t) => t.plain_text).join("") || "";

        const detailsRaw = props.Details?.rich_text || props.details?.rich_text || [];
        const detailsSegments = parseRichTextSegments(detailsRaw);
        const details = detailsSegments.map((t) => t.plain_text).join("") || "";

        const role = props.Role?.rich_text?.[0]?.plain_text || props.role?.rich_text?.[0]?.plain_text || props.Role?.select?.name || "";
        const type = props.Type?.select?.name || props.type?.select?.name || "";
        const techStack = (props.TechStack?.multi_select || props.techStack?.multi_select || []).map((t: any) => t.name);
        const github = props.Github?.url || props.github?.url || "";
        const link = props.Link?.url || props.link?.url || "";

        const imgProp = props.Image || props.image;
        let rawImageStr = "";
        if (imgProp?.type === "url" && imgProp?.url) {
          rawImageStr = imgProp.url;
        } else if (imgProp?.type === "rich_text" && imgProp?.rich_text) {
          rawImageStr = imgProp.rich_text.map((t: any) => t.plain_text).join("");
        } else if (imgProp?.type === "files" && imgProp?.files) {
          rawImageStr = imgProp.files.map((f: any) => f.file?.url || f.external?.url).filter(Boolean).join(",");
        }

        const imgsProp = props.Images || props.images;
        let rawImagesStr = "";
        if (imgsProp?.type === "url" && imgsProp?.url) {
          rawImagesStr = imgsProp.url;
        } else if (imgsProp?.type === "rich_text" && imgsProp?.rich_text) {
          rawImagesStr = imgsProp.rich_text.map((t: any) => t.plain_text).join("");
        } else if (imgsProp?.type === "files" && imgsProp?.files) {
          rawImagesStr = imgsProp.files.map((f: any) => f.file?.url || f.external?.url).filter(Boolean).join(",");
        }

        const combinedImageStr = [rawImageStr, rawImagesStr].filter(Boolean).join(",");
        const images = combinedImageStr
          .split(/[\n,]+/)
          .map((s: string) => s.trim())
          .filter(Boolean);

        const image = images[0] || "";

        const featured = props.Featured?.checkbox ?? props.featured?.checkbox ?? true;
        const published = props.Published?.checkbox ?? props.published?.checkbox ?? true;
        const order = props.Order?.number ?? props.order?.number ?? 99;

        return {
          id: page.id,
          title,
          description,
          descriptionSegments,
          details,
          detailsSegments,
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
  return projects.find((p) => p.id === id) || null;
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
        
        const detailsRaw = props.Details?.rich_text || props.details?.rich_text || [];
        const detailsSegments = parseRichTextSegments(detailsRaw);
        const details = detailsSegments.map((t) => t.plain_text).join("") || "";

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
          detailsSegments,
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
