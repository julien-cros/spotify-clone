import useSpotify from "../hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import { use, useCallback, useState } from "react"
import useSongInfo from "../hooks/useSongInfo"
import { useEffect } from "react"
import { SwitchHorizontalIcon, HeartIcon, VolumeUpIcon as VolumDownIcon,
	 ReplyIcon } from "@heroicons/react/outline"
import { PlayIcon, PauseIcon, RepeatIcon, ShuffleIcon, VolumeDownIcon, VolumeUpIcon,
	 RewindIcon, FastForwardIcon } from "@heroicons/react/solid"
import { debounce } from "lodash"

function Player() {
const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
	if (!songInfo) {
		spotifyApi.getMyCurrentPlayingTrack().then(data => {
			setCurrentTrackId(data.body?.item?.id);
			console.log("Now playing:", data.body?.item);

			spotifyApi.getMyCurrentPlaybackState().then((data) => {
				setIsPlaying(data.body?.is_playing);
			});
		})
	}
  }

  const handlePlayPause = () => {
	spotifyApi.getMyCurrentPlaybackState().then((data) => {
		if (data.body?.is_playing) {
			spotifyApi.pause();
			setIsPlaying(false);
		}
		else {
			spotifyApi.play();
			setIsPlaying(true);
		}
	})
  }

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, session]);


	useEffect(() => {
		if (volume >= 0 && volume <= 100 ) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((err) => console.log(err));
		}, 400), []
	);


  return (
	<div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 
	text-xs md:text-base px-2 md:px-8">
		<div className="flex items-center space-x-4">
			<img 
				className="hidden md:inline w-10 h-10 cursor-pointer"
				src={songInfo?.album.images?.[0]?.url} alt="" />
			<div>
				<h3>{songInfo?.name}</h3>
				<p>{songInfo?.artists?.[0]?.name}</p>
			</div>
		</div>

		<div className="flex items-center justify-evenly">
			<SwitchHorizontalIcon className="button"/>
			<RewindIcon className="button"/>
			{isPlaying ? (
				<PauseIcon className="w-10 h-10" onClick={handlePlayPause}/>
			) :(
				<PlayIcon className="w-10 h-10" onClick={handlePlayPause}/>
			) }
			<FastForwardIcon className="button"/>
			<ReplyIcon className="button"/>
		</div>

		<div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
			<VolumDownIcon 
				className="button" 
				onClick={() => volume > 0 && setVolume(volume - 10)}
			/>
			<input 
				type="range"
				min={0} 
				max={100} 
				value={volume} 
				onChange={(e) => setVolume(Number(e.target.value))} 
				className="w-24 h-1"
			/>
			<VolumeUpIcon
				className="button"
				onClick={() => (volume < 100 && setVolume(volume + 10))}
			/>
		</div>
	</div>
  )
}

export default Player