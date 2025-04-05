export interface Project {
  title: string;
  description: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "Search Engine Optimization (SEO)",
    description: "Search engine optimization (SEO) is the process of improving the volume or quality of traffic to a web site or a web page from search ...",
    link: "www.example.com/seo-project"
  },
  {
    title: "SEO - Wikipedia, the free encyclopedia",
    description: "SEO may refer to: Search engine optimization, the process of improving ranking in search engine results; Seasoned equity offering, a new equity issue by an already publicly-traded company",
    link: "en.wikipedia.org/wiki/SEO"
  },
  {
    title: "Search Engine Optimization (SEO) - Webmaster Tools Help",
    description: "SEO is an acronym for \"search engine optimizer.\" Deciding to hire an SEO is a big decision that can potentially improve your ...",
    link: "www.google.com/webmasters/tools/seo"
  }
];

export default projects; 