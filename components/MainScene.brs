' SofaSpark Party - BrightScript SceneGraph game controller
' On-device only. No network, accounts, ads, or data collection.
sub init()
    m.view = "home"
    m.mode = 0
    m.pack = 0
    m.round = 0
    m.scoreA = 0
    m.scoreB = 0
    m.sessionRounds = 0
    m.secondsLeft = 0
    m.running = false
    m.timer = m.top.findNode("secondTimer")
    m.timer.observeField("fire", "onSecond")
    m.pageTitle = m.top.findNode("pageTitle")
    m.pageSubtitle = m.top.findNode("pageSubtitle")
    m.footerText = m.top.findNode("footerText")
    m.modeGroup = m.top.findNode("modesGroup")
    m.packGroup = m.top.findNode("packsGroup")
    m.playGroup = m.top.findNode("playGroup")
    m.section = CreateObject("roRegistrySection", "SofaSparkParty")
    m.lifetimeRounds = 0
    if m.section.Exists("rounds")
        m.lifetimeRounds = Val(m.section.Read("rounds"))
    end if
    showHome()
    m.top.setFocus(true)
    m.top.signalBeacon("AppLaunchComplete")
end sub

function modeNames() as Object
    return ["Act It Out", "Pick A Side", "Beat The Clock", "Story Spark"]
end function

function packNames() as Object
    return ["Family Night", "Friends Night", "Date Night"]
end function

function modeSeconds() as Integer
    if m.mode = 0 then return 60
    if m.mode = 1 then return 45
    if m.mode = 2 then return 5
    return 75
end function

sub showHome()
    m.view = "home"
    stopTimer()
    m.modeGroup.visible = true
    m.packGroup.visible = false
    m.playGroup.visible = false
    m.pageTitle.text = "Pick your kind of fun"
    m.pageSubtitle.text = "Four games. One remote. Zero downloads for guests."
    m.footerText.text = "LEFT / RIGHT  -  CHOOSE GAME       OK  -  SELECT       BACK  -  EXIT"
    highlightModes()
end sub

sub showPacks()
    m.view = "packs"
    stopTimer()
    m.modeGroup.visible = false
    m.packGroup.visible = true
    m.playGroup.visible = false
    names = modeNames()
    m.pageTitle.text = names[m.mode]
    m.pageSubtitle.text = "Choose who is playing tonight"
    m.footerText.text = "LEFT / RIGHT  -  CHOOSE PACK       OK  -  START       BACK  -  GAMES"
    highlightPacks()
end sub

sub highlightModes()
    for i = 0 to 3
        s = i.ToStr()
        if i = m.mode
            m.top.findNode("modeFrame" + s).color = "#F973A5FF"
            m.top.findNode("modeFill" + s).color = "#283754FF"
        else
            m.top.findNode("modeFrame" + s).color = "#29334DFF"
            m.top.findNode("modeFill" + s).color = "#172340FF"
        end if
    end for
end sub

sub highlightPacks()
    for i = 0 to 2
        s = i.ToStr()
        if i = m.pack
            m.top.findNode("packFrame" + s).color = "#43D6B1FF"
            m.top.findNode("packFill" + s).color = "#283754FF"
        else
            m.top.findNode("packFrame" + s).color = "#29334DFF"
            m.top.findNode("packFill" + s).color = "#172340FF"
        end if
    end for
end sub

sub startGame()
    m.deck = deckFor(m.mode, m.pack)
    if m.deck.Count() = 0
        m.pageSubtitle.text = "This game pack is temporarily unavailable."
        return
    end if
    m.order = []
    for i = 0 to m.deck.Count() - 1
        m.order.Push(i)
    end for
    shuffleOrder()
    m.round = 0
    m.scoreA = 0
    m.scoreB = 0
    m.sessionRounds = 0
    m.view = "play"
    m.modeGroup.visible = false
    m.packGroup.visible = false
    m.playGroup.visible = true
    names = modeNames()
    packs = packNames()
    m.pageTitle.text = names[m.mode]
    m.pageSubtitle.text = packs[m.pack] + "   /   No phones needed   /   Pass the remote"
    m.footerText.text = "OK / RIGHT  -  NEXT     LEFT  -  PREVIOUS     UP  -  SUN +1     DOWN  -  MOON +1     PLAY  -  PAUSE"
    showPrompt(true)
end sub

sub shuffleOrder()
    ' Fisher-Yates: every prompt appears once before repeating.
    for i = m.order.Count() - 1 to 1 step -1
        j = Rnd(i + 1) - 1
        temp = m.order[i]
        m.order[i] = m.order[j]
        m.order[j] = temp
    end for
end sub

sub showPrompt(isNew as Boolean)
    m.top.findNode("promptLabel").text = m.deck[m.order[m.round]]
    m.top.findNode("counterLabel").text = "CARD " + Str(m.round + 1).Trim() + " / " + Str(m.deck.Count()).Trim()
    names = modeNames()
    m.top.findNode("turnLabel").text = "YOUR CHALLENGE  /  " + UCase(names[m.mode])
    if isNew
        m.sessionRounds = m.sessionRounds + 1
        m.lifetimeRounds = m.lifetimeRounds + 1
    end if
    updateScore()
    resetTimer()
end sub

sub updateScore()
    m.top.findNode("statsLabel").text = "TEAM SUN  " + m.scoreA.ToStr() + "      /      TEAM MOON  " + m.scoreB.ToStr() + "      /      " + m.sessionRounds.ToStr() + " CARDS PLAYED"
end sub

sub nextPrompt()
    m.round = m.round + 1
    if m.round >= m.order.Count()
        m.round = 0
        shuffleOrder()
    end if
    showPrompt(true)
end sub

sub previousPrompt()
    if m.round > 0
        m.round = m.round - 1
        showPrompt(false)
    end if
end sub

sub awardPoint(team as Integer)
    if team = 0
        m.scoreA = m.scoreA + 1
    else
        m.scoreB = m.scoreB + 1
    end if
    nextPrompt()
end sub

sub resetTimer()
    m.timer.control = "stop"
    m.secondsLeft = modeSeconds()
    m.running = true
    m.timer.control = "start"
    updateTimer()
end sub

sub stopTimer()
    m.timer.control = "stop"
    m.running = false
end sub

sub toggleTimer()
    if m.secondsLeft = 0
        resetTimer()
    else if m.running
        stopTimer()
        updateTimer()
    else
        m.running = true
        m.timer.control = "start"
        updateTimer()
    end if
end sub

sub updateTimer()
    timerLabel = m.top.findNode("timerLabel")
    if m.secondsLeft = 0
        timerLabel.text = "TIME UP!"
        timerLabel.color = "#F973A5FF"
    else
        minutes = Int(m.secondsLeft / 60)
        seconds = m.secondsLeft - minutes * 60
        secText = seconds.ToStr()
        if seconds < 10 then secText = "0" + secText
        timerLabel.text = "0" + minutes.ToStr() + ":" + secText
        if m.running
            timerLabel.color = "#43D6B1FF"
        else
            timerLabel.color = "#F8C568FF"
        end if
    end if
end sub

sub onSecond()
    if m.view <> "play" or not m.running then return
    if m.secondsLeft > 0
        m.secondsLeft = m.secondsLeft - 1
        updateTimer()
    end if
    if m.secondsLeft = 0 then stopTimer()
end sub

sub saveStats()
    m.section.Write("rounds", m.lifetimeRounds.ToStr())
    m.section.Flush()
end sub

function onKeyEvent(key as String, press as Boolean) as Boolean
    if not press then return false

    if m.view = "home"
        if key = "left"
            m.mode = (m.mode + 3) mod 4
            highlightModes()
            return true
        else if key = "right"
            m.mode = (m.mode + 1) mod 4
            highlightModes()
            return true
        else if key = "OK"
            m.pack = 0
            showPacks()
            return true
        else if key = "back"
            saveStats()
            return false ' Roku exits the root scene.
        end if
    else if m.view = "packs"
        if key = "left"
            m.pack = (m.pack + 2) mod 3
            highlightPacks()
            return true
        else if key = "right"
            m.pack = (m.pack + 1) mod 3
            highlightPacks()
            return true
        else if key = "OK"
            startGame()
            return true
        else if key = "back"
            showHome()
            return true
        end if
    else if m.view = "play"
        if key = "back"
            saveStats()
            showPacks()
            return true
        else if key = "OK" or key = "right"
            nextPrompt()
            return true
        else if key = "left"
            previousPrompt()
            return true
        else if key = "up"
            awardPoint(0)
            return true
        else if key = "down"
            awardPoint(1)
            return true
        else if key = "play"
            toggleTimer()
            return true
        else if key = "replay"
            resetTimer()
            return true
        end if
    end if

    return false
end function
