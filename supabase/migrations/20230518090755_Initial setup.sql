create extension if not exists "vector" with schema "extensions";

create sequence if not exists "public"."documents_id_seq";

create table if not exists "public"."documents" (
    "id" bigint not null default nextval('documents_id_seq'::regclass),
    "content" text,
    "embedding" vector(1536)
);

alter sequence "public"."documents_id_seq" owned by "public"."documents"."id";

CREATE INDEX documents_embedding_idx ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists='100');

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id bigint, content text, similarity double precision)
 LANGUAGE sql
 STABLE
AS $function$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$function$
;


