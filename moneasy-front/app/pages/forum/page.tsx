"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import ForumCard from "../../components/forumCard";
import { Post, Comment } from "../../types";
import { supabase } from "../../lib/supabaseClient";


const api = "http://127.0.0.1:8000/api";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR");


export default function ForumPage() {
  const router = useRouter();

  
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingC, setLoadingC] = useState(false);

  
  const [mode, setMode] = useState<"list" | "detail">("list");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

 
  const initSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    setToken(session.access_token);

    
    const { data: { user } } = await supabase.auth.getUser();
    const uRes = await fetch(`${api}/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ supabase_id: user?.id }),
    });
    const u = await uRes.json();
    setUserId(u.id);
  }, [router]);

  
  const fetchPosts = useCallback(async (t: string) => {
    setLoadingP(true);
    const res = await fetch(`${api}/post/`, { headers: { Authorization: `Bearer ${t}` } });
    const json = await res.json();
    setPosts(json.results ?? []);
    setLoadingP(false);
  }, []);

  
  const fetchComments = useCallback(
    async (postId: number, t: string) => {
      setLoadingC(true);

    
      const res = await fetch(`${api}/comment/by_post/?id=${postId}`, {
        headers: { Authorization: `Bearer ${t}` },
      });

     
      const data = await res.json();
      setComments(Array.isArray(data) ? data : data.results ?? []);

      setLoadingC(false);
    },
    [api]
  );

  
  useEffect(() => { initSession(); }, [initSession]);

  useEffect(() => { if (token) fetchPosts(token); }, [token, fetchPosts]);

  
  const openPost = async (p: Post) => {
    if (!token) return;
    setCurrentPost(p);
    await fetchComments(p.id, token);
    setMode("detail");
  };

 
  const createPost = async () => {
    if (!newTitle.trim() || !newBody.trim() || !token || !userId) return;
    const res = await fetch(`${api}/post/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newTitle.trim(), body: newBody.trim(), user: userId }),
    });
    if (res.ok) {
      await fetchPosts(token);
      setShowNew(false);
      setNewTitle("");
      setNewBody("");
    }
  };

 
  const [commentTxt, setCommentTxt] = useState("");

  const publishComment = async () => {
    if (!commentTxt.trim() || !token || !userId || !currentPost) return;

    const res = await fetch(`${api}/comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body: commentTxt.trim(),  
        post_id: currentPost.id,     
        user_id: userId,          
      }),
    });

    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);  
    setCommentTxt("");

  };

 
  return (
    <>
      <Header />
      <div className="flex">
        <Navbar active="forum" />

        <main className="flex-1 p-6 bg-gray-300 min-h-screen relative">

          {mode === "list" && (
            <>
              {loadingP ? (
                <p>Carregando…</p>
              ) : (
                posts.map(p => (
                  <ForumCard
                    key={p.id}
                    title={p.title}
                    date={p.created_at}
                    author={p.user.username}      
                    onClick={() => openPost(p)}
                  />
                ))
              )}

              <button
                onClick={() => setShowNew(true)}
                className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2
                           rounded-full shadow-lg hover:bg-green-700 transition"
              >
                + Novo Tópico
              </button>
            </>
          )}

          {mode === "detail" && currentPost && (
            <div className="space-y-6">
              <button
                onClick={() => setMode("list")}
                className="inline-flex items-center gap-1
                 bg-green-600 text-white text-sm
                 px-4 py-2 rounded-md
                 hover:bg-green-700 transition"
              >
                
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>

              <h1 className="text-2xl font-bold">{currentPost.title}</h1>
              <p className="text-sm text-gray-600 mb-4">
                por {currentPost.user.username} • {formatDate(currentPost.created_at)}
              </p>

              <p className="whitespace-pre-line bg-white rounded p-4 shadow">
                {currentPost.body}
              </p>

              <h2 className="font-semibold">Comentários</h2>

              {loadingC ? (
                <p>Carregando comentários…</p>
              ) : (
                <section className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="bg-white rounded p-4 shadow">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {c.user.username}
                      </p>
                      <p className="text-gray-900">{c.body}</p>
                      <span className="text-xs text-gray-500">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                  ))}
                </section>
              )}

              <div className="bg-white rounded p-4 shadow space-y-2">
                <textarea
                  rows={3}
                  value={commentTxt}
                  onChange={e => setCommentTxt(e.target.value)}
                  placeholder="Adicionar comentário…"
                  className="w-full border border-gray-300 rounded p-2 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={publishComment}
                    disabled={!commentTxt.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded
                               hover:bg-green-700 disabled:opacity-50"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showNew && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Novo Tópico</h2>

                <input
                  placeholder="Título"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
                />

                <textarea
                  placeholder="Conteúdo do post…"
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-4 resize-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNew(false)}
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
