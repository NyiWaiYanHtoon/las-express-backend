import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);
export async function getVideoDuration(filePath) {
    const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`);
    return parseFloat(stdout);
}
