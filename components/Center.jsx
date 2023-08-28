import React, { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline';
import {shuffle} from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import { playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from '../components/Songs'

const colors = [
	'from-blue-400',
	'from-green-400',
	'from-yellow-400',
	'from-red-400',
	'from-pink-400',
	'from-purple-400',
	'from-indigo-400',
	'from-gray-400',
	'from-slate-400',
	'from-emerald-400',
	'from-cyan-400',
	'from-fuchsia-400',
	'from-rose-400',
];

export default function Center() {
	const { data: session} = useSession();
	const [color, setColors] = useState(null);
	const playlistId = useRecoilValue(playlistIdState);
	const [playlist, setPlaylist] = useRecoilState(playlistState);
	const spotifyApi = useSpotify();

	useEffect(() => {
		setColors(shuffle(colors).pop())
	}, [playlistId])

	useEffect(() => {
		spotifyApi.getPlaylist(playlistId).then((data) => {
			setPlaylist(data.body);
		})
		.catch((err) => console.log("error when getplayslit;", err));
	}, [spotifyApi, playlistId])


  return (
	<div className='flex-grow h-screen overflow-y-scroll scrollbar-hide text-white'>
		<header className='absolute top-5 right-8'>
			<div className='flex items-center bg-black space-x-3 opacity-90 
				hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'
				onClick={() => signOut()}
				>
				<img src={session?.user.image} alt="image profile" className='rounded-full w-10 h-10'/>
			<h2 >{session?.user.name}</h2>
			<ChevronDownIcon className='h-5 w-5'/>
			</div>
		</header>

		<section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
		<img 
			className='h-44 w-44 shadow-2xl'
		src={playlist?.images?.[0]?.url} alt="playlist-img" />
		<div>
			<p>Playslist</p>
			<h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
		</div>
		</section>

		<div>
			<Songs />
		</div>
	</div>
  )
}
