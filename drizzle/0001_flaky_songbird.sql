CREATE TABLE "markdown_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"filename_on_filesystem" text NOT NULL,
	"custom_domain" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "markdown_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "page_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"filename" text NOT NULL,
	"filename_on_filesystem" text NOT NULL,
	"mimetype" text NOT NULL,
	"size" integer NOT NULL,
	"alt_text" text,
	"asset_type" text NOT NULL,
	"public_url" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"visitor_ip" text,
	"user_agent" text,
	"referer" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "markdown_pages" ADD CONSTRAINT "markdown_pages_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_assets" ADD CONSTRAINT "page_assets_page_id_markdown_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."markdown_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_page_id_markdown_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."markdown_pages"("id") ON DELETE cascade ON UPDATE no action;