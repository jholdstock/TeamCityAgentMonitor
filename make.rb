require "fileutils" 

FileUtils.rm_rf "TeamCityBuildMonitor.zip"
FileUtils.rm_rf "temp"
FileUtils.mkdir "temp"

FileUtils.cp_r "css", "temp\\css"
FileUtils.cp_r "vendor", "temp\\vendor"
FileUtils.cp_r "html", "temp\\html"
FileUtils.cp_r "img", "temp\\img"
FileUtils.cp_r "icon", "temp\\icon"
FileUtils.cp_r "js", "temp\\js"
FileUtils.cp_r "manifest.json", "temp"

require "zip/zip"
require "find"

class Zipper
  def self.zip(dir, zip_dir, remove_after = false)
    Zip::ZipFile.open(zip_dir, Zip::ZipFile::CREATE)do |zipfile|
      Find.find(dir) do |path|
        Find.prune if File.basename(path)[0] == ?.
        dest = /#{dir}\/(\w.*)/.match(path)
        begin
          zipfile.add(dest[1],path) if dest
        rescue Zip::ZipEntryExistsError
        end
      end
    end
    FileUtils.rm_rf(dir) if remove_after
  end 
end

Zipper.zip "temp", "TeamCityBuildMonitor.zip"

FileUtils.rm_rf "temp"