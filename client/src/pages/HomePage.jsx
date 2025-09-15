import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

// Home page showing document dashboard
function HomePage() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user's documents on mount
    useEffect(() => {
        const fetchDocuments = async () => {
            try{
                const response = await axios.get('/documents');
                setDocuments(response.data);
            }
            catch(err){
                console.error("Failed to fetch documents", err);
            } 
            finally{
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    // Create a new document and navigate to its page
    const createNewDocument = async () => {
        try{
            const response = await axios.post('/documents');
            navigate(`/document/${response.data._id}`);
        } 
        catch(err){
            console.error("Failed to create new document", err);
        }
    };

    return(
        <div className="bg-slate-900 text-gray-200 min-h-screen">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* New document section */}
                <div className="mb-12">
                    <h2 className="text-lg font-semibold text-gray-400 mb-3">Start a new document</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        <button
                            onClick={createNewDocument}
                            className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-700 transition-all aspect-w-3 aspect-h-4 group cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-sm font-medium text-gray-300">Blank Document</span>
                        </button>
                    </div>
                </div>

                <hr className="my-10 border-slate-700" />

                {/* Recent documents section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-400 mb-3">Recent documents</h2>
                    {isLoading ? (
                        <p className="text-gray-500">Loading documents...</p>
                    ) : documents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {documents.map((doc) => (
                                <Link to={`/document/${doc._id}`} key={doc._id} className="block p-4 bg-slate-800 rounded-lg border border-slate-700 hover:shadow-lg hover:border-indigo-500 transition-all aspect-w-3 aspect-h-4">
                                    <div className="font-semibold text-gray-200 truncate mb-2">
                                        {doc.title}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10 bg-slate-800 rounded-lg border border-slate-700">
                            <p>You have no documents yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default HomePage;