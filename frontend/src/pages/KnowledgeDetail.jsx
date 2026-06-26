// ============================================================
// දැනුම් ලිපි විස්තරය (Knowledge article detail)
// ============================================================
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Stethoscope, ShieldCheck, BookOpen } from 'lucide-react'
import client from '../api/client'
import { PageLoader, EmptyState } from '../components/ui'

export default function KnowledgeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    client.get(`/knowledge/${id}`)
      .then((res) => setArticle(res.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!article) return <EmptyState icon={BookOpen} title="Article not found"
    action={<Link to="/knowledge" className="btn-primary mt-4">Back to Knowledge Hub</Link>} />

  const isDisease = article.type === 'disease'

  return (
    <article className="container-x py-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2"><ArrowLeft className="w-4 h-4" /> Back</button>

      <span className={`badge mb-3 ${isDisease ? 'bg-clay/10 text-clay' : 'bg-spore/15 text-spore-600'}`}>
        {isDisease ? 'Disease Diagnostics' : 'Cultivation Guide'}
      </span>
      <h1 className="font-display font-700 text-3xl md:text-4xl text-pine-700 leading-tight">{article.title}</h1>
      <p className="mt-3 text-lg text-soil/60">{article.summary}</p>

      <img src={article.image} alt={article.title} className="mt-6 rounded-2xl w-full aspect-[16/9] object-cover" />

      {isDisease ? (
        // රෝග ආකෘතිය: ලක්ෂණ + ප්‍රතිකාර (disease layout: symptoms + treatment)
        <div className="mt-8 space-y-5">
          <div className="card p-6 border-amber-200 bg-amber-50/50">
            <h2 className="flex items-center gap-2 font-display font-600 text-lg text-amber-800 mb-2">
              <AlertTriangle className="w-5 h-5" /> Symptoms
            </h2>
            <p className="text-soil/75 leading-relaxed">{article.symptoms}</p>
          </div>
          <div className="card p-6 border-emerald-200 bg-emerald-50/50">
            <h2 className="flex items-center gap-2 font-display font-600 text-lg text-emerald-800 mb-2">
              <ShieldCheck className="w-5 h-5" /> Treatment & prevention
            </h2>
            <p className="text-soil/75 leading-relaxed">{article.treatment}</p>
          </div>
        </div>
      ) : (
        // මාර්ගෝපදේශ ආකෘතිය (guide layout)
        <div className="mt-8 card p-6 md:p-8">
          <p className="text-soil/80 leading-loose whitespace-pre-line text-[17px]">{article.body}</p>
        </div>
      )}

      <div className="mt-10 p-6 rounded-2xl bg-pine-50 flex items-center gap-4">
        <Stethoscope className="w-8 h-8 text-pine-700 shrink-0" />
        <p className="text-sm text-pine-700/80">Need supplies to act on this guide?
          <Link to="/shop" className="font-semibold underline ml-1">Browse spawn & equipment</Link>.</p>
      </div>
    </article>
  )
}
