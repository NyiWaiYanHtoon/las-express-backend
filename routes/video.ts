import { Response, Request } from "express";
import { Router } from "express";
import multer from "multer";
import { streamUpload } from "../utils/stream-upload-to-cloudinary";
import { insertVideo } from "../utils/insert-video";
import { uploadThumbnail } from "../utils/upload-thumbnail-to-cloudinary";
import { isFilesFieldsObject } from "../utils/validate-files";
import { selectVideoWithCount } from "../utils/select-video";
import { getTopViewedFromDB, getVideoStatsFromDB } from "../utils/select-video-with-stats";
import { deleteVideo } from "../utils/delete-video";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Number(req.query.pageSize) as number || 12;
    const search = req.query.search as string || "";
    const id = req.query.id as string || undefined;
    const userId= req.query.userId as string || undefined;

    const data = await selectVideoWithCount((page - 1) * pageSize, pageSize, search, id, userId)
    if (!data) res.status(500).send("Something went wrong!");
    return res.json(data);
  } catch (err) {
    console.log('Failed to fetch videos:', err);
    res.status(500).send("Something went wrong!");
  }
});

router.post("/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {

    try {

      //check the userrole
      const user = req.user as {
        dbUser: {
          id: string;
          email: string;
          joinedAt: Date;
          role: 'user' | "admin";
        },
        username: string,
        photoUrl: string
      };
      if (!user || user.dbUser.role != "admin") {
        return res.status(405).send("Only Admin can upload")
      }
      //check if the files are uploaded properly or not
      if (!isFilesFieldsObject(req.files)) {
        return res
          .status(400)
          .send("Something went wrong!");
      }

      const videoFile = req.files["video"]?.[0];
      const thumbnailFile = req.files["thumbnail"]?.[0];

      if (!videoFile || !thumbnailFile) {
        return res.status(400).send("Something went wrong!");
      }

      const videoUploadResult = await streamUpload(videoFile);
      if (!videoUploadResult) {
        return res.status(500).send("Something went wrong!");
      }

      const thumbnailUploadResult = await uploadThumbnail(thumbnailFile);
      if (!thumbnailUploadResult) {
        return res.status(500).send("Something went wrong!");
      }

      const insertResult = await insertVideo(
        videoUploadResult,
        req.body.title,
        req.body.description,
        req.body.tags ? req.body.tags.split(",") : [],
        req.body.category,
        thumbnailUploadResult,
        parseFloat(req.body.duration),
        user.dbUser.id
      );

      if (!insertResult) {
        return res.status(500).send("Something went wrong!");
      }

      return res.status(200).json({
        video: insertResult,
        message: "Video created",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong!");
    }
  }
);

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = 5
    const timestamp = (req.query.timestamp as string) || 'all'

    //call util function with offset and timestamp string
    const result = await getVideoStatsFromDB((page - 1) * pageSize, pageSize, timestamp)

    if (!result) return res.status(500).send("Something went wrong!")
    res.status(200).json(result)

  } catch (err) {
    console.log('Error fetching video stats:', err)
    res.status(500).send("Something went wrong!")
  }
})

router.get('/most-viewed', async (_req: Request, res: Response) => {
  try {
    const result = await getTopViewedFromDB("desc")
    if (!result) res.status(500).send("Something went wrong!")
    res.status(200).json({ videos: result });
  } catch (err) {
    console.log('Error fetching most viewed videos:', err)
    res.status(500).send("Something went wrong!")
  }
})

router.get('/least-viewed', async (_req: Request, res: Response) => {
  try {
    const result = await getTopViewedFromDB("asc")
    if (!result) res.status(500).send("Something went wrong!")
    res.status(200).json({ videos: result });
  } catch (err) {
    console.log('Error fetching least viewed videos:', err)
    res.status(500).send("Something went wrong!")
  }
})

router.delete('/delete', async (req, res) => {
  const { videoId } = req.body
  console.log("called: ", videoId);
  if (!videoId) return res.status(400).json({ message: 'Video ID is required.' })

  try {
    await deleteVideo(videoId)
    res.status(200).json({ message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting video:', error)
    res.status(500).json({ message: 'Failed to delete video.' })
  }
})

export default router;
