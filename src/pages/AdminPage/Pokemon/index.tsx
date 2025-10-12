"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Star, Zap, Shield, Heart } from "lucide-react"

export default function PokemonManagement() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [showAddDialog, setShowAddDialog] = useState(false)

    // Mock data
    const pokemonList = [
        {
            id: 1,
            name: "ピカチュウ",
            nameVi: "Pikachu",
            type: "Electric",
            rarity: "Rare",
            level: 25,
            hp: 35,
            attack: 55,
            defense: 40,
            image: "/electric-mouse-character.png",
        },
        {
            id: 2,
            name: "リザードン",
            nameVi: "Charizard",
            type: "Fire",
            rarity: "Legendary",
            level: 36,
            hp: 78,
            attack: 84,
            defense: 78,
            image: "/powerful-fire-dragon.png",
        },
        {
            id: 3,
            name: "フシギバナ",
            nameVi: "Venusaur",
            type: "Grass",
            rarity: "Rare",
            level: 32,
            hp: 80,
            attack: 82,
            defense: 83,
            image: "/venusaur.png",
        },
        {
            id: 4,
            name: "カメックス",
            nameVi: "Blastoise",
            type: "Water",
            rarity: "Rare",
            level: 36,
            hp: 79,
            attack: 83,
            defense: 100,
            image: "/blastoise.png",
        },
        {
            id: 5,
            name: "ミュウツー",
            nameVi: "Mewtwo",
            type: "Psychic",
            rarity: "Legendary",
            level: 70,
            hp: 106,
            attack: 110,
            defense: 90,
            image: "/psychic-pokemon.png",
        },
        {
            id: 6,
            name: "イーブイ",
            nameVi: "Eevee",
            type: "Normal",
            rarity: "Common",
            level: 10,
            hp: 55,
            attack: 55,
            defense: 50,
            image: "/eevee.png",
        },
    ]

    const types = ["all", "Fire", "Water", "Grass", "Electric", "Psychic", "Normal", "Fighting", "Flying", "Dragon"]

    const stats = [
        { label: "Total Pokemon", value: "156", change: "+12" },
        { label: "Legendary", value: "24", change: "+2" },
        { label: "Rare", value: "48", change: "+5" },
        { label: "Common", value: "84", change: "+5" },
    ]

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "Legendary":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            case "Rare":
                return "text-blue-400 bg-blue-400/10 border-blue-400/20"
            case "Common":
                return "text-gray-400 bg-gray-400/10 border-gray-400/20"
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20"
        }
    }

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Fire: "text-red-400 bg-red-400/10",
            Water: "text-blue-400 bg-blue-400/10",
            Grass: "text-green-400 bg-green-400/10",
            Electric: "text-yellow-400 bg-yellow-400/10",
            Psychic: "text-purple-400 bg-purple-400/10",
            Normal: "text-gray-400 bg-gray-400/10",
        }
        return colors[type] || "text-gray-400 bg-gray-400/10"
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Pokemon Management</h1>
                    <p className="text-gray-400 mt-1">Manage all Pokemon in the system</p>
                </div>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Pokemon
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <span className="text-green-400 text-sm">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Pokemon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedType === type
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pokemon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pokemonList.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                    >
                        <div className="flex gap-4">
                            <img
                                src={pokemon.image || "/placeholder.svg"}
                                alt={pokemon.name}
                                className="w-20 h-20 rounded-lg bg-gray-800"
                            />
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-white font-semibold">{pokemon.name}</h3>
                                        <p className="text-gray-400 text-sm">{pokemon.nameVi}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-blue-400 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(pokemon.type)}`}>{pokemon.type}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs border ${getRarityColor(pokemon.rarity)}`}>
                                        {pokemon.rarity}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Level
                                </span>
                                <span className="text-white font-medium">{pokemon.level}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Heart className="w-3 h-3" /> HP
                                </span>
                                <span className="text-white font-medium">{pokemon.hp}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Zap className="w-3 h-3" /> Attack
                                </span>
                                <span className="text-white font-medium">{pokemon.attack}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Defense
                                </span>
                                <span className="text-white font-medium">{pokemon.defense}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Pokemon Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Pokemon</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Japanese Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Vietnamese Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                        <option>Fire</option>
                                        <option>Water</option>
                                        <option>Grass</option>
                                        <option>Electric</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Rarity</label>
                                    <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                        <option>Common</option>
                                        <option>Rare</option>
                                        <option>Legendary</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Level</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">HP</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Attack</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Defense</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddDialog(false)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Add Pokemon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
