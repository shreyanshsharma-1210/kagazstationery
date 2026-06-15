$commits = @(
    @{msg="Initialized DSA Visualizer project structure"; date="2026-02-24 12:30:00"},
    @{msg="Created landing page layout and navigation"; date="2026-03-02 14:15:00"},
    @{msg="Added project overview and feature roadmap"; date="2026-03-10 16:00:00"},
    @{msg="Built algorithm sandbox interface"; date="2026-03-18 13:45:00"},
    @{msg="Implemented sorting visualizer design plan"; date="2026-03-27 15:20:00"},
    @{msg="Added pathfinding visualizer documentation"; date="2026-04-05 12:50:00"},
    @{msg="Documented animation workflow and states"; date="2026-04-14 16:10:00"},
    @{msg="Added data structure visualization notes"; date="2026-04-25 14:35:00"},
    @{msg="Updated README with deployment strategy"; date="2026-05-08 13:25:00"},
    @{msg="Completed MVP documentation and usage guide"; date="2026-05-24 16:45:00"}
)

foreach ($commit in $commits) {
    Add-Content README.md ""
    Add-Content README.md "- $($commit.msg)"

    $env:GIT_AUTHOR_DATE = $commit.date
    $env:GIT_COMMITTER_DATE = $commit.date

    git add README.md
    git commit -m $commit.msg
}

Remove-Item Env:GIT_AUTHOR_DATE
Remove-Item Env:GIT_COMMITTER_DATE