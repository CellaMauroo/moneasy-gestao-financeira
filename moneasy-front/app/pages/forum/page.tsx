/* app/pages/forum/page.tsx */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import ForumCard from "../../components/forumCard";
import { Post, Comment } from "../../types";
import { supabase } from "../../lib/supabaseClient";

/* ╭──────────────────────────────────────────────────────────────╮
   │                       Página de Fórum                        │
   ╰──────────────────────────────────────────────────────────────╯ */

export default function ForumPage() {
  const router = useRouter();

  /* sessão ------------------------------------------------------ */
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  /* tópicos ----------------------------------------------------- */
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  /* tela de detalhe -------------------------------------------- */
  const [mode, setMode] = useState<"list" | "detail">("list");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  /* modal novo tópico ------------------------------------------ */
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  /* estado comentário ------------------------------------------ */
  const [commentText, setCommentText] = useState("");

  /* helpers de api --------------------------------------------- */
  const api = "http://127.0.0.1:8000/api";

  const fetchSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setToken(session.access_token);

    /* registra / obtém id do usuário na API Django */
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const uRes = await fetch(`${api}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ supabase_id: user?.id }),
    });
    const u = await uRes.json();
    setUserId(u.id);
  }, [api, router]);

  const fetchPosts = useCallback(
    async (t: string) => {
      setLoadingPosts(true);
      const res = await fetch(`${api}/post/`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const json = await res.json();
      setPosts(json.results ?? []);
      setLoadingPosts(false);
    },
    [api]
  );

  const fetchComments = useCallback(
    async (postId: number, t: string) => {
      setLoadingComments(true);

      const res = await fetch(`${api}/comment/by_post/?id=${postId}`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      const data = await res.json();

      /* se for lista plana, usa direto; se vier paginado, cai no .results */
      setComments(Array.isArray(data) ? data : data.results ?? []);

      setLoadingComments(false);
    },
    [api]
  );


  /* inicial ----------------------------------------------------- */
  useEffect(() => {
    (async () => {
      await fetchSession();
    })();
  }, [fetchSession]);

  /* carrega posts sempre que pegar token ------------------------ */
  useEffect(() => {
    if (token) fetchPosts(token);
  }, [token, fetchPosts]);

  /* ───────────── handlers ────────────────────────────────────── */

  const openPost = async (post: Post) => {
    if (!token) return;
    setCurrentPost(post);
    await fetchComments(post.id, token);
    setMode("detail");
  };

  const createPost = async () => {
    if (!newTitle.trim() || !newBody.trim() || !token || !userId) return;
    const res = await fetch(`${api}/post/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle.trim(),
        body: newBody.trim(),
        user: userId,
      }),
    });
    if (res.ok) {
      await fetchPosts(token);
      setShowNewPost(false);
      setNewTitle("");
      setNewBody("");
    }
  };

  const publishComment = async () => {
    if (!commentText.trim() || !token || !userId || !currentPost) return;
    const res = await fetch(`${api}/comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body: commentText.trim(),
        post: currentPost.id,
        user: userId,
      }),
    });
    if (res.ok) {
      const newC = await res.json();
      setComments((prev) => [...prev, newC]);
      setCommentText("");
    }
  };

  /* ───────────── UI ──────────────────────────────────────────── */

  return (
    <>
      <Header />
      <div className="flex">
        <Navbar active="forum" />

        <main className="flex-1 p-6 bg-gray-300 min-h-screen relative">
          {/* LISTA DE TÓPICOS ------------------------------------------------- */}
          {mode === "list" && (
            <>
              {loadingPosts ? (
                <p>Carregando…</p>
              ) : (
                posts.map((p) => (
                  <ForumCard
                    key={p.id}
                    title={p.title}
                    date={p.created_at}
                    onClick={() => openPost(p)}
                  />
                ))
              )}

              <button
                onClick={() => setShowNewPost(true)}
                className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2
                           rounded-full shadow-lg hover:bg-green-700 transition"
              >
                + Novo Tópico
              </button>
            </>
          )}

          {/* DETALHE DO TÓPICO ----------------------------------------------- */}
          {mode === "detail" && currentPost && (
            <div className="space-y-6">
              {/* ← BOTÃO VOLTAR ------------------------------------------------ */}
              <button
                onClick={() => setMode("list")}
                className="inline-flex items-center gap-1 bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                {/* ícone seta */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>

              <h1 className="text-2xl font-bold">{currentPost.title}</h1>

              <p className="whitespace-pre-line bg-white rounded p-4 shadow">
                {currentPost.body}
              </p>

              <h2 className="font-semibold">Comentários</h2>

              {loadingComments ? (
                <p>Carregando comentários…</p>
              ) : (
                <section className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-white rounded p-4 shadow">
                      <p className="text-gray-800">{c.body}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </section>
              )}

              <div className="bg-white rounded p-4 shadow space-y-2">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Adicionar comentário…"
                  className="w-full border border-gray-300 rounded p-2 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={publishComment}
                    disabled={!commentText.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded
                               hover:bg-green-700 disabled:opacity-50"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL NOVO POST ------------------------------------------------- */}
          {showNewPost && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Novo Tópico</h2>

                <input
                  type="text"
                  placeholder="Título"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                />

                <textarea
                  placeholder="Conteúdo do post…"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-4 resize-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createPost}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
