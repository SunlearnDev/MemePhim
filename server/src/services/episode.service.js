const { Episode } = require("../models/index");

class EpisodeService {
    static processEpisodeData(data, serverName) {
        return data.server_data?.map(episode => ({
            server_name: serverName,
            name: episode.name,
            slug: episode.slug,
            filename: episode.filename,
            link_m3u8: episode.link_m3u8,
            link_embed: episode.link_embed
        })) || [];
    }


  static async getEpisodeById(id) {
    try {
      const episode = Episode.findByPk(id);
      return episode;
    } catch (error) {
      throw error;
    }
  }
  static async getEpisodeMovie(id) {
    try {
      const episode = await Episode.findAll({ where: { movieId: id }, attributes:[
        "server_name",
        "name",
        "slug",
        "filename",
        "link_embed",
        "link_m3u8",
      ] });
      return episode;
    } catch (error) {
      throw error;
    }
  }
  static async createEpisodes(data, movieId) {
    const episodes = this.processEpisodeData(data, data.server_name);
    for (const episode of episodes) {
        await this.createEpisode(episode, movieId);
    }
  }
  static async createEpisode(data, movieId) {
    try {
      const newEpisode = await Episode.create({
        movieId: movieId,
        server_name: data.server_name,
        name: data.name,
        slug: data.slug,
        filename: data.filename,
        link_embed: data.link_embed,
        link_m3u8: data.link_m3u8,
      });
      console.log(`Created new episode: ${newEpisode.name} ${newEpisode.filename}`);
      return newEpisode;
    } catch (error) {
      throw error;
    }
  }
  static async updateEpisode(id, data) {
    try {
      const episode = await Episode.findByPk(id);
      if (episode) {
        await Episode.update(data, {
          where: { id: id },
        });
        return data;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  static async deleteEpisode(id) {
    try {
      const episode = await Episode.findByPk(id);
      if (episode) {
        await Episode.destroy({
          where: { id: id },
        });
        return episode;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EpisodeService;
