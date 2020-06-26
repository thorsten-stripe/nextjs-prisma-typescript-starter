import { PrismaClient, Song, Artist } from '@prisma/client';

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const songs = await prisma.song.findMany({
    include: { artist: { include: { songs: true } } },
  });

  return {
    props: {
      songs,
    },
  };
}

export default ({
  songs,
}: {
  songs: (Song & {
    artist: Artist & {
      songs: Song[];
    };
  })[];
}) => (
  <ul>
    {songs.map((song) => (
      <li key={song.id}>
        {song.name} by {song.artist.name}
      </li>
    ))}
  </ul>
);
